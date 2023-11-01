/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useAppDispatch } from "~/app/_redux/hooks";
import { setProvider } from "~/app/_redux/slices/createClusterSlice";
import type { Session } from "next-auth";
import { Button, Heading, Card } from "@/components/ui";
import Image from "next/image";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface ProviderProps {
  sessionData: Session | null;
  vpcId?: string | undefined;
}

const CloudProvider: React.FC<ProviderProps> = ({ vpcId }) => {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const onClickHandler = () => {
    // if use has no vpcId, will redirect to aws credientials page
    if (!vpcId) {
      router.push("/create-cluster/aws");
      dispatch(setProvider("aws"));
    }
    // if vpcID does exist, redirect to region page
    else {
      router.push("/create-cluster/region");
      dispatch(setProvider("region"));
    }
  };

  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/create-cluster/size");
  };

  return (
    <Card.Root variant={"outlined"} className="max-w-1/3 p-6">
      <Card.Header className="mb-8 h-full">
        <Heading.Root className="p-0">
          <Heading.Headlines
            headline="Choose Your Provider"
            subhead="Please enter your AWS credentials below to connect your account."
          />
        </Heading.Root>
      </Card.Header>
      <Card.Media className="flex flex-col gap-3">
        <Button
          variant={"ghost"}
          className="h-full w-full items-center justify-start focus:bg-accent focus:text-accent-foreground"
        >
          <Image
            src="https://library.humio.com/integrations/images/amazon_msk.png"
            width={272}
            height={264}
            alt="msk"
            className="mr-2 h-10 w-10 rounded mix-blend-exclusion"
          />
          <div className="flex flex-col items-start justify-start">
            <p className="leading-7 [&:not(:first-child)]:mt-6">Amazon MSK</p>
            <p className="text-sm text-muted-foreground">
              Amazon Managed Streaming for Apache Kafka
            </p>
          </div>
        </Button>
        <Button
          disabled
          variant={"ghost"}
          onClick={onClickHandler}
          className="h-full w-full items-center justify-start"
        >
          <Image
            src="https://library.humio.com/integrations/images/amazon_msk.png"
            width={272}
            height={264}
            alt="msk"
            className="mr-2 h-10 w-10 rounded mix-blend-exclusion"
          />
          <div className="flex flex-col items-start justify-start">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Amazon MSK Serverless
            </p>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>
        </Button>
      </Card.Media>
      <div className="mt-8 flex w-full  flex-col-reverse justify-between gap-2 md:flex-row">
        <Button onClick={backHandler} variant={"ghost"} className="">
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>

        <Button onClick={onClickHandler}>
          Submit
        </Button>
      </div>
    </Card.Root>
  );
};

export { CloudProvider };
