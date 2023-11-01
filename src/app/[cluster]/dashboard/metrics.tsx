/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import { useMetricsContext } from "~/app/_context/metrics-ctx";
import { Input, Label, Button, Heading, Card } from "@/components/ui";
import {
  ComponentInstanceIcon,
  CubeIcon,
  CardStackIcon,
} from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { LayersIcon, CopyIcon } from "@radix-ui/react-icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Metrics = () => {
  const {
    clusterMetrics: { metrics },
  } = useMetricsContext();

  return (
    <div>
      <Heading.Root>
        <LayersIcon className="h-8 w-8 " />
        <Heading.Headlines headline={metrics?.ClusterName ?? "Cluster Name"} />
      </Heading.Root>
      <div className="grid grid-cols-3">
        <div className="col-span-2" />
        <div className="col-span-1">
          <Card.Root variant={"outlined"} className=" ">
            <Card.Header className="flex h-min w-full justify-around border-b-2 py-5">
              <div className="">
                <p>State</p>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {metrics?.State}
                </h4>
              </div>
              <div className="h-full w-1 border" />
              <div>
                <p>Kafka Version</p>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {metrics?.KafkaVersion}
                </h4>
              </div>
            </Card.Header>
            <Card.Media className="flex w-full justify-around py-3">
              <div className="flex flex-col items-center justify-center gap-1">
                <CubeIcon className="h-6 w-6 text-blue-500" />
                Storage
                <p>
                  {
                    metrics?.cluster.BrokerNodeGroupInfo.StorageInfo
                      .EbsStorageInfo.VolumeSize 
                  }{" "}
                  GB
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <ComponentInstanceIcon className="h-6 w-6 text-green-500" />
                Instance
                <p>{metrics?.instanceSize}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <CardStackIcon className="h-6 w-6 text-amber-500" />
                Brokers
                <p>{metrics?.NumberOfBrokerNodes}</p>
              </div>
            </Card.Media>
            <Table className="border-t-2">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Endpoint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics?.bootStrapServer.map((server: string) => (
                  <TableRow key={server} className="overflow-hidden">
                    <Button
                      onClick={() => navigator.clipboard.writeText(server)}
                      variant={"ghost"}
                    >
                      <CopyIcon className="inline h-4 w-4" />
                    </Button>
                    <TableCell className="w-fit truncate ">{server}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card.Root>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
