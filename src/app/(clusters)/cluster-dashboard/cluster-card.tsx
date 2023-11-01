/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import { Card, Heading, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ComponentInstanceIcon, CubeIcon } from "@radix-ui/react-icons";
type Props = {
  status: number;
  name: string;
  cluster: {
    name: string;
    cluster_id: string;
    createdAt: Date | null;
    img: string | null;
    user_id: string | null;
    securityGroup: unknown;
    brokerPerZone: number | null;
    instanceSize: string | null;
    lifeCycleStage: number | null;
    storagePerBroker: string | null
  };
};

const ClusterCard = ({ status, name, cluster }: Props) => {
  const router = useRouter();
  const { data } = api.cluster.checkClusterStatus.useQuery({
    id: cluster.cluster_id,
  });
  const deleteCluster = api.cluster.deleteCluster.useMutation();

  const [delCluster, setdelCluster] = useState<string>("");
  const [isHoverDelete, updateHover] = useState<boolean>(false);

  const routeToCluster = () => {
    if (!isHoverDelete && cluster.lifeCycleStage === 2) {
      router.push(`${cluster.cluster_id}/dashboard`);
    }
  };

  const deleteClusterHandler = () => {
    try {
      deleteCluster.mutate({
        id: cluster.cluster_id,
      });
      router.push("/cluster-dashboard");
    } catch (err) {
      console.log("Error occurred when deleting cluster on frontend: ", err);
    }
  };

  const badgeColor: Record<
    number,
    {
      color: string;
      text: string;
    }
  > = {
    0: {
      color: "text-green-600 border-green-600 bg-green-200",
      text: "creating",
    },
    1: {
      color: "text-yellow-600 border-yellow-600 bg-yellow-200",
      text: "updating",
    },
    3: {
      color: "text-red-600 border-red-600 bg-red-200",
      text: "deleting",
    },
    2: {
      color: "text-blue-600 border-blue-600 bg-blue-200",
      text: "live",
    },
  };

  const badge = badgeColor[status];
  return (
    <Card.Root
      variant={"outlined"}
      className={`max-h-[245px] overflow-hidden`}
      onClick={routeToCluster}
    >
      <Card.Media className={cn("h-[200px] w-full", badge?.color)}>
        <div className={cn("h-16 w-full", badge?.color)} />
      </Card.Media>
      <Card.Header className="h-min">
        <Heading.Root className="items-start">
          <Heading.Headlines headline={name} />
        </Heading.Root>
      </Card.Header>
      <Card.Text className="gap-2">
        <p className="text-sm text-muted-foreground ">
          <ComponentInstanceIcon className="inline h-4 w-4 text-blue-500" />{" "}
          {cluster.instanceSize}
        </p>
        <p className="text-sm text-muted-foreground">
          <CubeIcon className="inline h-4 w-4 text-green-500" />{" "}
          {cluster.storagePerBroker} GB
        </p>
        <div className="flex w-full items-end justify-end">
          <Badge className={cn(badge?.color)} variant={"outline"}>
            {badge?.text}
          </Badge>
        </div>
      </Card.Text>
    </Card.Root>
  );
};

export default ClusterCard;
