import { z } from "zod";
import { EC2Client } from "@aws-sdk/client-ec2";
import { KafkaClient, CreateConfigurationCommand } from "@aws-sdk/client-kafka";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
  createVPC,
  createIGW,
  connectIGWandVPC,
  createSubnets,
  createRouteTables,
  createRouteIGW,
  createClusterConfig,
} from "../../service/createVPCService";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const createVPCRouter = createTRPCRouter({
  createVPC: publicProcedure
    .input(
      z.object({
        aws_access_key_id: z.string(),
        aws_secret_access_key: z.string(),
        region: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // creating custom config based on user input
      const config = {
        region: input.region,
        credentials: {
          accessKeyId: input.aws_access_key_id,
          secretAccessKey: input.aws_secret_access_key,
        },
      };

      const ec2Client = new EC2Client(config);

      const client = new KafkaClient(config);

      /**
       * This will go through all the steps in the initial set up of the VPC
       */
      try {
        // get vpc id
        const vpcId = await createVPC(ec2Client);

        // Create the IGW
        const igwId = await createIGW(ec2Client);

        // attach IGW to VPC
        await connectIGWandVPC(ec2Client, vpcId, igwId);

        // Create subnets
        const subnetIdArr = await createSubnets(ec2Client, vpcId, input.region);

        // Create route table
        const routeTableId = await createRouteTables(ec2Client, vpcId);

        // Create route for IGW
        await createRouteIGW(ec2Client, routeTableId, igwId);

        // create cluster config file
        const configArn = await createClusterConfig(client);

        /**
         * Send required info to db
         */
        try {
          // updates the user in the database with the vpc and subnet ids

          const userId = ctx.session?.user.id;
          if (!userId) throw Error("No user sessionId in vpcRouter.createVPC");
          await ctx.db
            .update(users)
            .set({
              awsAccessKey: input.aws_access_key_id,
              awsSecretAccessKey: input.aws_secret_access_key,
              region: input.region,
              configArn: configArn,
              vpcId: vpcId,
              subnetId: JSON.stringify(subnetIdArr),
            })
            .where(eq(users.id, userId));
        } catch (error) {
          console.log(
            "Ran into error updating user in db, lost VPC, fix in cli., ",
            error,
          );
          return false;
        }
      } catch (error) {
        console.log("Ran into error creating VPC and subnets ", error);
        return false;
      }
    }),

  /**
   * given a id of a user, will return the respective vpcId
   */
  findVPC: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    if (!userId) throw Error("No user sessionId in vpcRouter.findVpc");
    try {
      const userResponse = await ctx.db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      return userResponse?.vpcId;
    } catch (error) {
      console.log("Encountered error finding the user in the database", error);
      return undefined;
    }
  }),

  /**
   * given a id of a user, will return the respective list of subnets
   */
  findSubnets: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userResponse = await ctx.db.query.users.findFirst({
          where: eq(users.id, input.id),
        });
        return userResponse?.subnetId as string;
      } catch (error) {
        console.log(
          "Encountered error finding the user in the database",
          error,
        );
      }
    }),
});
