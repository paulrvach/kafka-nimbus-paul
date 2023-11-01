/**
 * Add a topic, edit a topic, delete a topic
 * create partitions
 * fetch metadata
 *
 */

import { z } from "zod";
import AWS from "aws-sdk";
import { db } from "~/server/db";

import { Kafka, logLevel } from "kafkajs";
import { createMechanism } from "@jm18457/kafkajs-msk-iam-authentication-mechanism";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { eq } from "drizzle-orm";
import { clusters, topics, users } from "~/server/db/schema";

const configEntriesSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const topicRouter = createTRPCRouter({
  createTopic: publicProcedure
    .input(
      z.object({
        id: z.string(),
        topicName: z.string(),
        numPartitions: z.number().default(-1),
        replicationFactor: z.number().default(-1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First, use id to get the aws access that we need to make changes
      try {
        const userId = ctx.session?.user.id;
        if (!userId)
          throw Error("No session error in topicsRouter.createTopic");

        const clusterResponse = await db.query.clusters.findFirst({
          where: eq(clusters.user_id, userId),
        });

        if (!clusterResponse) {
          throw new Error("Cluster does not exist");
        }

        const userResponse = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!userResponse) {
          throw new Error("User does not exist");
        }

        const awsAccessKey = userResponse.awsAccessKey!;
        const awsSecretAccessKey = userResponse.awsSecretAccessKey!;
        const region = userResponse.region!;

        /** TODO getting bootStrapServer public endpoints. For now manually adding the brokers */
        const BootstrapIds = clusterResponse.bootStrapServer! as string;

        // update aws config
        // possibly unneccessary
        AWS.config.update({
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretAccessKey,
          region: region,
        });

        // create kafkajs config
        const kafka = new Kafka({
          clientId: "my-app",
          brokers: JSON.parse(BootstrapIds) as string[],
          logLevel: logLevel.ERROR,
          ssl: true,
          sasl: createMechanism({
            region: region,
            credentials: {
              accessKeyId: awsAccessKey,
              secretAccessKey: awsSecretAccessKey,
            },
          }),
        });

        // create kafkajs instance
        const admin = kafka.admin();
        await admin.connect();

        // create the topic
        const createResult = await admin.createTopics({
          timeout: 30000,
          topics: [
            {
              topic: input.topicName,
              numPartitions: input.numPartitions,
              replicationFactor: input.replicationFactor,
              // replicaAssignment: input.replicaAssignment,
              // configEntries: input.configEntries,
            },
          ],
        });

        await admin.disconnect();
        if (!createResult) {
          return "Topic already exists";
        }

        /**
         * Store new cluster in db
         */
        // don't need to error check if the cluster name already exists because we
        // do that when grabbing the user.
        const topicResponse = await db.insert(topics).values({
          name: input.topicName,
          numPartitions: input.numPartitions,
          replicationFactor: input.replicationFactor,
          cluster_id: clusterResponse.cluster_id,
          id: input.topicName,
        });
        return createResult;
      } catch (error) {
        console.log("Error creating topic ,", error);
      }
    }),
});
