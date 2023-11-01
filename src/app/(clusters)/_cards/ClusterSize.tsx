"use client";
import React, { useState } from "react";
import { useAppDispatch } from "~/app/_redux/hooks";
import { setClusterSize } from "~/app/_redux/slices/createClusterSlice";
import {
  Button,
  Heading,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

type StorageOptions = {
  name: string;
  partitions: string;
  vCPU: string;
  mem: string;
  gbps: string;
};

function ClusterSize() {
  const router = useRouter();
  // various sizes that the cluster could be, recommended to be as small
  // as possible
  const storageOptions: StorageOptions[] = [
    {
      name: "kafka.t3.small",
      partitions: "300 recommended max partition count",
      vCPU: "vCPU: 2",
      mem: "Memory (GiB): 2",
      gbps: "Network bandwidth (Gbps): 5",
    },
    {
      name: "kafka.m5.large",
      partitions: "1000 recommended max partition count",
      vCPU: "vCPU: 2",
      mem: "Memory (GiB): 8",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.xlarge",
      partitions: "1000 recommended max partition count",
      vCPU: "vCPU: 4",
      mem: "Memory (GiB): 16",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.2xlarge",
      partitions: "2000 recommended max partition count",
      vCPU: "vCPU: 8",
      mem: "Memory (GiB): 32",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.4xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 16",
      mem: "Memory (GiB): 64",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.8xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 32",
      mem: "Memory (GiB): 128",
      gbps: "Network bandwidth (Gbps): 10",
    },
    {
      name: "kafka.m5.12xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 48",
      mem: "Memory (GiB): 192",
      gbps: "Network bandwidth (Gbps): 12",
    },
    {
      name: "kafka.m5.16xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 64",
      mem: "Memory (GiB): 256",
      gbps: "Network bandwidth (Gbps): 20",
    },
    {
      name: "kafka.m5.24xlarge",
      partitions: "4000 recommended max partition count",
      vCPU: "vCPU: 64",
      mem: "Memory (GiB): 256",
      gbps: "Network bandwidth (Gbps): 25",
    },
  ];

  const dispatch = useAppDispatch();
  const [sizeValue, setSizeValue] =
    useState<StorageOptions["name"]>("kafka.t3.small");

  // stores cluster size decision in redux state
  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setClusterSize(sizeValue));
    router.push("/create-cluster/brokers");
  };

  // changes cluster size stored in state
  const onSelectHandler = (size: string) => {
    setSizeValue(size);
  };

  // sets state to previous page
  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/create-cluster/name");
  };

  return (
    <div className="flex flex-row items-center gap-8 p-20">
      <Card.Root variant={"outlined"} className="max-w-1/3 p-6">
        <Card.Header className="mb-8 h-full">
          <Heading.Root className="p-0">
            <Heading.Headlines
              headline="Select Server Size"
              subhead="How the cluster will be identified in console."
            />
          </Heading.Root>{" "}
        </Card.Header>

        <form
          onSubmit={onSubmitHandler}
          className="flex w-full flex-col items-center justify-center"
        >
          <Select onValueChange={onSelectHandler} defaultValue={sizeValue}>
            <SelectTrigger>
              <SelectValue placeholder={sizeValue} />
            </SelectTrigger>
            <SelectContent>
              {storageOptions.map((storageOption) => (
                <SelectItem value={storageOption.name} key={storageOption.name}>
                  {storageOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-8  flex w-full flex-col-reverse justify-between gap-2 md:flex-row">
            <Button onClick={backHandler} variant={"ghost"} className="">
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Card.Root>
      <div>
        {storageOptions.map((item) => {
          if (item.name === sizeValue) {
            return (
              <Table key={item.name}>
                <TableCaption>Server specs.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>GBS</TableCell>
                    <TableCell>{item.gbps}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Memory</TableCell>
                    <TableCell>{item.mem}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Partitions</TableCell>
                    <TableCell>{item.partitions}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>vCPU</TableCell>
                    <TableCell>{item.vCPU}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            );
          }
        })}
      </div>
    </div>
  );
}

export { ClusterSize };
