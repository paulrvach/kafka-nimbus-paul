"use client";
import React, { useState } from "react";
import { useAppDispatch } from "~/app/_redux/hooks";
import { setRegion } from "~/app/_redux/slices/createClusterSlice";
import {
  Button,
  Heading,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

function RegionInput() {
  const router = useRouter();
  // the available aws regions
  const regions = [
    "N. Virginia (us-east-1)",
    "Ohio (us-east-2)",
    "Ireland (eu-west-1)",
    "Tokyo (ap-northeast-1)",
    "Oregon (us-west-2)",
  ];

  const dispatch = useAppDispatch();
  const [currentRegion, setCurrentRegion] = useState<string>(
    "N. Virginia (us-east-1)",
  );

  // handles what happens when you select a region, and converts it to the proper form
  const onSelectHandler = (value: string) => {
    const getContentInParentheses = (str: string): string => {
      const regex = /\(([^)]+)\)/; // Regular expression to match content inside parentheses
      const matches: RegExpMatchArray | null = str.match(regex); // Find matches using the regex
      const matchResult = matches !== null ? matches[1] : "";
      const result = matchResult ?? "";
      return result; // Return the content inside the parentheses (group 1)
    };

    // changes region stored in state
    const selectedRegion = getContentInParentheses(value);
    setCurrentRegion(selectedRegion);
  };

  // submit to redux state
  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setRegion(currentRegion));
    router.push("/create-cluster/name");
  };

  // sets state to previous page
  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/create-cluster/provider");
  };

  return (
    <Card.Root variant={"outlined"} className="max-w-1/3 p-6">
      <Card.Header className="mb-8 h-full">
        <Heading.Root className="p-0">
          <Heading.Headlines
            headline="Select Region"
            subhead="Select Amazon cloud computing resource location."
          />
        </Heading.Root>
      </Card.Header>
      <Card.Media>
        <form onSubmit={onSubmitHandler} className="w-full">
          <Select onValueChange={onSelectHandler} defaultValue={currentRegion}>
            <SelectTrigger>
              <SelectValue placeholder={currentRegion} />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => {
                return (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <p className="mt-8 max-w-prose flex-wrap text-sm text-muted-foreground">
            These locations are composed of AWS Regions, Availability Zones, and
            Local Zones. Each AWS Region is a separate geographic area.
          </p>
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

export { RegionInput };
