// import statements
import { db } from "../db";
import type AWS from "aws-sdk";
import * as fs from "fs";
import * as path from "path";
import {
  KafkaClient,
  GetBootstrapBrokersCommand,
  UpdateConnectivityCommand,
  DescribeClusterCommand,
  DescribeClusterV2Command,
} from "@aws-sdk/client-kafka";
import { PanelsArray } from "./grafana-panels";
import { clusters, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getClusterResponse = async (clusterId: string, userId: string) => {
  try {
    console.log("clusterId", clusterId);

    const userResponse = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (userResponse === undefined) {
      throw new Error("User does not exist on the cluster Response");
    }
    const clusterResponse = await db.query.clusters.findFirst({
      where: eq(clusters.cluster_id, clusterId),
    });
    if (clusterResponse === undefined) {
      throw new Error("Cluster does not exist on the cluster Response");
    }
    // only take out the values that we need
    const response = {
      awsAccessKey: userResponse.awsAccessKey,
      awsSecretAccessKey: userResponse.awsSecretAccessKey,
      region: userResponse.region,
      lifeCycleStage: clusterResponse.lifeCycleStage,
      kafkaArn: clusterResponse.kafkaArn,
    };
    return response;
  } catch (err) {
    throw new Error("Error finding the unique user in database");
  }
};

/**
 *
 * @param kafka
 * @param kafkaArn
 * @returns curState of the cluster
 *
 * Uses the amazon sdk to fetch the response of describing the cluster,
 * which lets ups grab the current state of the cluster.
 */
export const describeCluster = async (kafka: KafkaClient, kafkaArn: string) => {
  if (kafkaArn === "" || kafkaArn === undefined) {
    throw new Error("kafkaArn not included in request");
  }
  try {
    const cluster = new DescribeClusterV2Command({
      ClusterArn: kafkaArn,
    });
    const describeClusterResponse = await kafka
      .send(cluster)
      .catch((err) => console.log("ERROR=============", err));

    if (!describeClusterResponse) {
      throw new Error("SDK couldn't find the cluster");
    }
    const curState = describeClusterResponse.ClusterInfo?.State;
    if (curState === undefined) {
      throw new Error("Cur state is undefined");
    }
    return curState;
  } catch (err) {
    throw new Error("Error describing cluster " );
  }
};

/**
 *
 * @param region C
 * @param awsAccessKey
 * @param awsSecretAccessKey
 * @param kafkaArn
 * @param id
 * @returns none
 *
 * When the cluster first goes from creating to active, it updates the public
 * access, which can only be done on an active cluster. This so that there
 * are public endpoints which we can access.
 */
export const updatePublicAccess = async (
  region: string,
  awsAccessKey: string,
  awsSecretAccessKey: string,
  kafkaArn: string,
  id: string,
) => {
  const client: KafkaClient = new KafkaClient({
    region: region,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  });
  if (kafkaArn === "" || kafkaArn === undefined) {
    throw new Error("KafkaArn doesn't exist");
  }
  if (client === undefined) {
    throw new Error("Kafka error");
  }
  try {
    // get the current version so that we can update the public access params
    const cluster = new DescribeClusterCommand({
      ClusterArn: kafkaArn,
    });
    const describeClusterResponse = await client.send(cluster);

    const connectivityInfo =
      describeClusterResponse.ClusterInfo?.BrokerNodeGroupInfo?.ConnectivityInfo
        ?.PublicAccess?.Type;

    const currentVersion = describeClusterResponse.ClusterInfo?.CurrentVersion;
    if (connectivityInfo !== "SERVICE_PROVIDED_EIPS") {
      // now we want to turn on public access
      const updateParams = {
        ClusterArn: kafkaArn,
        ConnectivityInfo: {
          PublicAccess: {
            Type: "SERVICE_PROVIDED_EIPS", // enables public access
          },
        },
        CurrentVersion: currentVersion,
      };

      const commandUpdate = new UpdateConnectivityCommand(updateParams);
      await client.send(commandUpdate);
    }

   
    await db
      .update(clusters)
      .set({ lifeCycleStage: 1 })
      .where(eq(clusters.cluster_id, id));
  } catch (err) {
    throw new Error("Error updating cluster, ");
  }
};

export const getBoostrapBrokers = async (
  region: string,
  awsAccessKey: string,
  awsSecretAccessKey: string,
  kafkaArn: string,
  id: string,
) => {
  /**
   * Cluster going from updating to active - get boostrap servers
   */
  const client = new KafkaClient({
    region: region,
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  try {
    const getBootstrapBrokersCommand = new GetBootstrapBrokersCommand({
      ClusterArn: kafkaArn,
    });
    const bootstrapResponse = await client.send(getBootstrapBrokersCommand);
    const brokers = bootstrapResponse.BootstrapBrokerStringPublicSaslIam
      ? bootstrapResponse.BootstrapBrokerStringPublicSaslIam
      : "";
    const splitBrokers = brokers.split(",");
    if (brokers === undefined || splitBrokers === undefined) {
      throw new Error("Error getting brokers");
    }
    console.log("successfully got boostrap brokers: ", splitBrokers);

    
    await db
      .update(clusters)
      .set({ lifeCycleStage: 2, bootStrapServer: JSON.stringify(splitBrokers) })

      .where(eq(clusters.cluster_id, id));
    console.log("----CHECKING HERE----");
    // store in the targets.json file for prometheus
    addToPrometheusTarget(splitBrokers, id);
  } catch (err) {
    throw new Error("Error going from updating to active, ");
  }
};

interface Labels {
  job: string;
}

interface Job {
  labels: Labels;
  targets: string[];
}

export const createDash = (clusterUuid: string) => {
  // create dash
  const datasource = "bfcb852b-7b48-4dc8-8177-f2a71442d372";
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    `Bearer glsa_kGlHG9R4fXY4OOGh7D43zIpDKdYwAb8D_6ac93f73` ,
  );

  const raw = JSON.stringify({
    dashboard: {
      id: null,
      uid: clusterUuid,
      title: clusterUuid,
      tags: ["MSK-Cluster"],
      timezone: "browser",
      schemaVersion: 16,
      version: 0,
      refresh: "25s",

      annotations: {
        list: [
          {
            $$hashKey: "object:3299",
            builtIn: 1,
            datasource: {
              type: "prometheus",
              uid: datasource,
            },
            enable: true,
            hide: true,
            iconColor: "rgba(0, 211, 255, 1)",
            limit: 100,
            name: "Annotations & Alerts",
            showIn: 0,
            type: "dashboard",
          },
        ],
      },
      editable: true,
      fiscalYearStartMonth: 0,
      graphTooltip: 0,
      links: [],
      liveNow: false,
      panels: PanelsArray(clusterUuid),

      style: "light",

      templating: {
        list: [],
      },
      time: {
        from: "now-30m",
        to: "now",
      },
      timepicker: {
        refresh_intervals: [
          "5s",
          "10s",
          "30s",
          "1m",
          "5m",
          "15m",
          "30m",
          "1h",
          "2h",
          "1d",
        ],
        time_options: [
          "5m",
          "15m",
          "1h",
          "6h",
          "12h",
          "24h",
          "2d",
          "7d",
          "30d",
        ],
      },

      weekStart: "",
    },
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://paulrvach.grafana.net/api/dashboards/db", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export const addToPrometheusTarget = (
  brokers: string[],
  clusterUuid: string,
) => {
  // get the boostrapbrokers
  // slice the last four digits off
  // const newBrokerArr: string[] = [];
  // for (const broker of brokers) {
  //   // remove the port and replace with 11001 so that prometheus can see it
  //   newBrokerArr.push(broker.slice(0, broker.length - 4) + "11001");
  // }

  // // define the newjob obj that we are goin g to store in targets.json so that
  // // prometheus tracks it
  // const newJob = {
  //   labels: {
  //     job: clusterUuid,
  //   },
  //   targets: newBrokerArr,
  // };

  // const srcPath = path.join("./src/server/targets.json");
  // const targetsData = JSON.parse(fs.readFileSync(srcPath, "utf8")) as Job[];

  // // Add the new job to the targets data
  // targetsData.push(newJob);
  // const updatedTargetsData = JSON.stringify(targetsData, null, 2);
  // fs.writeFileSync(srcPath, updatedTargetsData, "utf8");

  // const destPath = path.resolve('/usr/app/config', 'targets.json');
  // fs.copyFileSync(srcPath, destPath);
  // await fetch('http://157.230.13.68:9090/-/reload', {
  //   method: 'POST',
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error('HTTP request failed.');
  //     }
  //     // Process the successful response here
  //     console.log('Refreshed Prometheus');
  //   })
  //   .catch((error) => {
  //     // Handle any errors that occurred during the request
  //     console.error(error);
  //   });

  console.log("---ADDED TO PROMETHEUS---");
  createDash(clusterUuid);
};

export const getDash = async (uuid: string, apiKey: string) => {
  try {
    const fetchDashboard = await fetch(
      "https://paulrvach.grafana.net/api/dashboards/uid/" + uuid,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ` + apiKey,
        },
      },
    );
      console.log(fetchDashboard)
    const dashboard = (await fetchDashboard.json()) as unknown;
    return dashboard
  } catch (error) {
    throw new Error("Error fetching dashboard");
  }
};
