"use client"
import React from "react";
import { useAppDispatch } from "~/app/_redux/hooks";
import {
  setBrokerNumbers,
  setZones,
} from "~/app/_redux/slices/createClusterSlice";
import {
  Button,
  Heading,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
} from "@/components/ui";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

function BrokerCounterInput() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // amount of brokers that can be created
  const brokerNumArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // when the select changes, changes the number of brokers stored in state
  const onSelectHandler = (value: string) => {
    dispatch(setBrokerNumbers(Number(value)));
  };
  // changes the # zones stored in state
  const onSelectHandlerZones = (value: string) => {
    dispatch(setZones(Number(value)));
  };

  // dispatches both the number of zones, and the number of brokers to redux
  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/create-cluster/storage");
  };

  // sets state to previous page
  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/create-cluster/size");
  };

  return (
    <Card.Root variant={"outlined"} className="max-w-1/3 p-6">
      <Card.Header className="mb-8 h-full">
        <Heading.Root className="p-0">
          <Heading.Headlines
            headline="Select Zones"
            subhead="Please enter your AWS credentials below to connect your account."
          />
        </Heading.Root>
      </Card.Header>
      <Card.Media>
        <form onSubmit={onSubmitHandler} className="w-full">
          <div className="mb-8 flex flex-col gap-2">
            <Label className="">Avalability Zones</Label>
            <Select onValueChange={onSelectHandlerZones} defaultValue={"2"}>
              <SelectTrigger>
                <SelectValue placeholder="How many zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"2"} key={2}>
                  2
                </SelectItem>
                <SelectItem value={"3"} key={3}>
                  3
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="max-w-prose flex-wrap text-sm text-muted-foreground">
              AWS Availability Zones are isolated data centers within a region
              that provide redundancy and high availability for cloud resources.
            </p>
          </div>
          <div className="mb-8 flex flex-col gap-2">
            <Label className="">
              Brokers{" "}
              <em className="max-w-prose flex-wrap text-sm text-muted-foreground">
                (per zone)
              </em>
            </Label>
            <Select onValueChange={onSelectHandler} defaultValue={"1"}>
              <SelectTrigger>
                <SelectValue placeholder="How many brokers?" />
              </SelectTrigger>
              <SelectContent>
                {brokerNumArray.map((num) => (
                  <SelectItem value={num.toString()} key={num}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="max-w-prose flex-wrap text-sm text-muted-foreground">
              Brokers handle all requests from clients to write and read events.
            </p>
          </div>
          <div className="mt-8  flex  flex-col-reverse justify-between gap-2 md:flex-row">
            <Button onClick={backHandler} variant={"ghost"} className="">
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Card.Media>
    </Card.Root>
  );
}

export { BrokerCounterInput };
