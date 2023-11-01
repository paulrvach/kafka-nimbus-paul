"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/_redux/hooks";
import { setStoragePerBroker } from "~/app/_redux/slices/createClusterSlice";
import { Button, Heading, Card, Label, Input } from "@/components/ui";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { useRouter } from "next/navigation";
import { type createClusterHandlerPrams } from "../create-cluster/[card]/page";

interface ProviderProps {
  createClusterHandler: ({ data }: createClusterHandlerPrams) => void;
}

const StoragePerBroker: React.FC<ProviderProps> = ({
  createClusterHandler,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const data = useAppSelector((state) => state.createCluster); // pulling down the redux store, createCluster slice

  // handles selection of storage and stores it in redux state
  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    createClusterHandler({ data });

    // setInFocus("loading");
  };

  // changes storage size stored in state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(setStoragePerBroker(value));
  };

  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/create-cluster/brokers");
  };

  return (
    <Card.Root variant={"outlined"} className="max-w-1/3 p-6">
      <Card.Header className="mb-8 h-full">
        <Heading.Root className="p-0">
          <Heading.Headlines
            headline="Enter storage per. broker"
            subhead="Configure the desired space amount in gigabytes for a Kafka broker"
          />
        </Heading.Root>
      </Card.Header>
      <form onSubmit={onSubmitHandler} className="w-full">
        <div className="form-control">
          <Label>Enter amount</Label>
          <div className="flex max-w-md items-center justify-center">
            <Input
              type="number"
              placeholder="10"
              className="inline-block"
              onChange={handleInputChange}
            />
            <span className="p-3">GB</span>
          </div>
        </div>
        <div className="mt-8  flex  flex-col-reverse justify-between gap-2 md:flex-row">
          <Button onClick={backHandler} variant={"ghost"} className="">
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Card.Root>
  );
};

export { StoragePerBroker };
