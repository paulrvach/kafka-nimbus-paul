import { z } from "zod";
import { MSKCFnTempleteBody } from "./cloudformation-templete";
import {
  CloudFormationClient,
  CreateStackCommand,
  type CreateStackCommandInput,
} from "@aws-sdk/client-cloudformation"; // ES Modules import

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const mskRouter = createTRPCRouter({
  deployCloudFormation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        aws_access_key_id: z.string(),
        aws_secret_access_key: z.string(),
        region: z.string(),
        brokerPerZone: z.number(),
        instanceSize: z.string(),
        zones: z.number(),
        storagePerBroker: z.number(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      function getContentInParentheses(inputString: string) {
        const regex = /\(([^)]+)\)/; // Regular expression to match content within parentheses
        const match = regex.exec(inputString);

        if (match && match.length > 1) {
          return match[1]; // Return the content within parentheses
        } else {
          return null; // Return null if no match is found
        }
      }

      const config = {
        region: getContentInParentheses(input.region)!,
        credentials: {
          accessKeyId: input.aws_access_key_id,
          secretAccessKey: input.aws_secret_access_key,
        },
      };

      const client = new CloudFormationClient(config);
      const { brokerPerZone, instanceSize, name, storagePerBroker } = input;

      const cfnInput: CreateStackCommandInput = {
        StackName: "mskCloudFormation",
        TemplateBody: JSON.stringify(MSKCFnTempleteBody),
        Capabilities: ["CAPABILITY_NAMED_IAM"],
        Parameters: [
          {
            ParameterKey: "WanttoDeployinNewVPC",
            ParameterValue: "true",
          },
          {
            ParameterKey: "VPCCidr",
            ParameterValue: "10.0.0.0/16", // Replace with your desired VPC CIDR block
          },
          {
            ParameterKey: "MSKClusterName",
            ParameterValue: name, // Replace with the name for your MSK cluster
          },
          {
            ParameterKey: "kafkaVersion",
            ParameterValue: "2.8.1", // Replace with the desired Kafka version
          },
          {
            ParameterKey: "brokerNodeInstanceType",
            ParameterValue: instanceSize, // Replace with the desired Kafka version
          },
          {
            ParameterKey: "numberOfBrokerNodes",
            ParameterValue: JSON.stringify(brokerPerZone), // Replace with the desired Kafka version
          },
          {
            ParameterKey: "KeyName",
            ParameterValue: "msk-ec2-keypair", // Replace with the desired Kafka version
          },
          ///
          {
            ParameterKey: "VPCID",
            ParameterValue: "", // Replace with the desired Kafka version
          },
          {
            ParameterKey: "SubnetID2",
            ParameterValue: "", // Replace with the desired Kafka version
          },
          {
            ParameterKey: "SubnetID3",
            ParameterValue: "", // Replace with the desired Kafka version
          },
          {
            ParameterKey: "SubnetID1",
            ParameterValue: "", // Replace with the desired Kafka version
          },
          {
            ParameterKey: "PublicSubnetID",
            ParameterValue: "", // Replace with the desired Kafka version
          },
          // Include other MSK parameters as needed
        ],
      };
      const command = new CreateStackCommand(cfnInput);
      // console.log(ctx, input)
      try {
        const response = await client.send(command);
        console.log(response);
      } catch (error) {
        console.log("Error in clusterRouter:\n", error);
        return false;
      }
    }),
});
