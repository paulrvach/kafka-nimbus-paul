"use client";
import { api } from "~/trpc/react";
import * as Card from "../../_cards";
import { useRouter } from "next/navigation";

export type createClusterHandlerPrams = {
  data: {
    provider: string;
    awsId: string;
    awsSecret: string;
    region: string;
    clusterName: string;
    brokerNumbers: number;
    storagePerBroker: number;
    clusterSize: string;
    zones: number;
  };
};

export type CardType =
  | "provider"
  | "aws"
  | "region"
  | "name"
  | "size"
  | "brokers"
  | "storage"
  | "loading";

function getContentInParentheses(inputString: string) {
  const regex = /\(([^)]+)\)/; // Regular expression to match content within parentheses
  const match = regex.exec(inputString);

  if (match && match.length > 1) {
    return match[1]; // Return the content within parentheses
  } else {
    return null; // Return null if no match is found
  }
}

function ClusterCard({ params }: { params?: { card: CardType } }) {
  const createCluster = api.cluster.createCluster.useMutation();
  const createVpc = api.vpc.createVPC.useMutation();
  const findVpcId = api.vpc.findVPC.useQuery({});
  const router = useRouter();

  const createClusterHandler = async ({ data }: createClusterHandlerPrams) => {
    const vpcId = findVpcId.data;
    if (vpcId !== undefined) {
      router.push("/create-cluster/loading");

      await createVpc.mutateAsync({
        aws_access_key_id: data.awsId,
        aws_secret_access_key: data.awsSecret,
        region: getContentInParentheses(data.region)!,
      });
    }

    await createCluster.mutateAsync({
      brokerPerZone: data.brokerNumbers,
      instanceSize: data.clusterSize,
      name: data.clusterName,
      storagePerBroker: data.storagePerBroker,
      zones: data.zones,
    });
    router.push("/cluster-dashboard");
  };

  switch (params?.card) {
    case "provider":
      return <Card.CloudProvider vpcId={findVpcId.data!} sessionData={null} />;
    case "aws":
      return <Card.AwsSecrets />;
    case "region":
      return <Card.RegionInput />;
    case "name":
      return <Card.ClusterNameInput />;
    case "size":
      return <Card.ClusterSize />;
    case "brokers":
      return <Card.BrokerCounterInput />;
    case "storage":
      return (
        <Card.StoragePerBroker createClusterHandler={createClusterHandler} />
      );
    case "loading":
      return <Card.ClusterLoadingState />;
  }
}

export default ClusterCard;
