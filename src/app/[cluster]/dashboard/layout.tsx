import React from "react";
import { MetricsContextProvider } from "~/app/_context/metrics-ctx";
import {
  KafkaClient,
  DescribeClusterCommand,
  type DescribeClusterCommandInput,
  type DescribeClusterCommandOutput,
} from "@aws-sdk/client-kafka";
import {
  Kafka,
  logLevel,
  AssignerProtocol,
  type ITopicMetadata,
  ConfigResourceTypes,
  type Admin,
  type DescribeConfigResponse,
} from "kafkajs";
import { getDash } from "src/server/service/checkClusterService";
import {
  type Options,
  createMechanism,
} from "@jm18457/kafkajs-msk-iam-authentication-mechanism";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { clusters, users } from "~/server/db/schema";
import type {
  ClusterMetrics,
  ConsumerGroups,
} from "~/app/_context/metrics-ctx";

interface ClusterDashboardLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  params: { cluster: string };
}

type responseType = ClusterMetrics

async function ClusterDashboardLayout({
  children,
  params,
}: ClusterDashboardLayoutProps) {
  // The initial empty response of fetching the metrics

  const response: responseType = {};
  try {
    const clusterInfo = await db.query.clusters.findFirst({
      where: eq(clusters.cluster_id, params.cluster),
    });
    if (!clusterInfo) {
      throw new Error("Error: Cluster does not exist in the database");
    }

    const userInfo = await db.query.users.findFirst({
      where: eq(users.id, clusterInfo.user_id!),
    });
    if (!userInfo) {
      throw new Error("Error: Cluster does not exist in the database");
    }

    //get bootstrap public endpoints
    // and deconstruct more of the database fetch
    const brokers = JSON.parse(
      clusterInfo.bootStrapServer as string,
    ) as string[];

    const bootStrapServer = clusterInfo.bootStrapServer as string;
    const kafkaArn = clusterInfo.kafkaArn!;
    const instanceSize = clusterInfo.instanceSize!;

    const accessKeyId = userInfo.awsAccessKey;
    const secretAccessKey = userInfo.awsSecretAccessKey;
    const region = userInfo.region;

    if (
      !region ||
      !accessKeyId ||
      !secretAccessKey ||
      !kafkaArn ||
      !instanceSize
    )
      throw Error("missing aws credentials in layout");

    const authParams: Options = {
      region: region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };

    //AWS kafka client
    const client = new KafkaClient(authParams);
    //KafkaJS client
    const kafka: Kafka = new Kafka({
      clientId: `Cluster${params.cluster}`,
      brokers: brokers,
      logLevel: logLevel.ERROR,
      ssl: true,
      sasl: createMechanism(authParams),
    });
    // GETTING METRICS
    const metricsDashboard = await getDash(
      params.cluster,
      "glsa_kGlHG9R4fXY4OOGh7D43zIpDKdYwAb8D_6ac93f73",
    );

    console.log("METRICSDASH: ", metricsDashboard);

    //Cluster Dashboard Information from MSK
    const commInput: DescribeClusterCommandInput = {
      ClusterArn: clusterInfo?.kafkaArn ? clusterInfo?.kafkaArn : "",
    };

    const command = new DescribeClusterCommand(commInput);
    const descClusterResponse: DescribeClusterCommandOutput =
      await client.send(command);

    const cluster = descClusterResponse.ClusterInfo;
    if (!cluster) throw new Error("Error: MSK Cluster does not have info");
    const {
      ClusterName,
      CreationTime,
      CurrentBrokerSoftwareInfo,
      NumberOfBrokerNodes,
      State,
    } = cluster;
    if (
      !ClusterName ||
      !CreationTime ||
      !CurrentBrokerSoftwareInfo?.KafkaVersion ||
      !NumberOfBrokerNodes ||
      !State ||
      !bootStrapServer
    )
      throw Error("Missing cluster info in [cluster]/dashboard/layout");

    response.metrics = {
      metricsDashboard: metricsDashboard,
      ClusterName,
      CreationTimeString: CreationTime?.toLocaleDateString(),
      KafkaVersion: CurrentBrokerSoftwareInfo.KafkaVersion,
      NumberOfBrokerNodes,
      State,
      bootStrapServer: JSON.parse(bootStrapServer) as [],
      kafkaArn,
      instanceSize,
      cluster
    };
    //GETTING TOPICS using kafkajs

    const admin: Admin = kafka.admin();
    const fetchTopicMetaResponse = await admin.fetchTopicMetadata();
    if (!fetchTopicMetaResponse)
      throw new Error("Error: No topics data received from KJS client");

    // Helper function to get specific information from a specific topic
    const descTopicConfig = async function (
      name: string,
    ): Promise<DescribeConfigResponse> {
      try {
        const responseConfig = await admin.describeConfigs({
          includeSynonyms: false,
          resources: [
            {
              type: ConfigResourceTypes.TOPIC,
              name,
              configNames: [
                "cleanup.policy",
                "retention.ms",
                "message.format.version",
                "file.delete.delay.ms",
                "max.message.bytes",
                "index.interval.bytes",
              ],
            },
          ],
        });
        return responseConfig;
      } catch (err) {
        throw err;
      }
    };

    // Processing each topic's data and storing it in an array topicsData
    const kTopicsData: ITopicMetadata[] = fetchTopicMetaResponse.topics;

    const topicsData: unknown[] = [];
    for (const topic of kTopicsData) {
      //add config description to topic
      const configData = await descTopicConfig(topic.name);

      // get offsetdata for each Topic
      const offSetData = await admin.fetchTopicOffsets(topic.name);
      if (configData !== undefined) {
        const config = configData.resources[1]
          ? configData?.resources[0]?.configEntries
          : [];
        topicsData.push({
          ...topic,
          config: config!,
          offsets: offSetData,
        });
      }
    }
    response.topics = topicsData;

    // GETTING CONSUMER GROUPS
    const listGroups = await admin.listGroups();
    // getting list of consumer group Ids
    const groupIds = listGroups.groups.map((group) => group.groupId);

    const groupsData: ConsumerGroups = [];
    const describeGroupsResponse = await admin.describeGroups(groupIds);
    const descGroups = describeGroupsResponse.groups;

    // for each group in array add to members and subscribedTopics List
    for (const group of descGroups) {
      const { groupId, protocol, state, members } = group;
      let membersId: string[] = [];
      const subscribedTopics: string[] = [];
      if (members.length > 0) {
        membersId = members.map((member) => member.memberId);
        if (members[0] !== undefined) {
          const memberAssignmentInfo = AssignerProtocol.MemberAssignment.decode(
            members[0].memberAssignment,
          ) ?? { assignment: {} };
          const memberAssignment = memberAssignmentInfo?.assignment;
          for (const key of Object.keys(memberAssignment)) {
            subscribedTopics.push(key);
          }
        }
      }
      groupsData.push({
        groupId,
        protocol,
        state,
        members: membersId,
        subscribedTopics,
      });
    }

    response.consumerGroups = groupsData;
  } catch (error) {
    throw new Error("Error occurred when getting metrics for cluster");
  }

  return (
    <MetricsContextProvider initClusterMetrics={response}>
      {children}
    </MetricsContextProvider>
  );
}

export default ClusterDashboardLayout;
