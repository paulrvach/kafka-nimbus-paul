"use client";
import React, { useState } from "react";
import { useAppDispatch } from "~/app/_redux/hooks";
import { setAwsId, setAwsSecret } from "~/app/_redux/slices/createClusterSlice";
import { Input, Label, Button, Heading, Card } from "@/components/ui";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
//  ProviderProps is the focus handler

function AwsSecrets() {
  const dispatch = useAppDispatch();
  const [awsIdValue, setAwsIdValue] = useState<string>(""); // states to handle input
  const [awsSecretValue, setAwsSecretValue] = useState<string>("");
  const router = useRouter();

  // add current user info from state to redux
  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setAwsId(awsIdValue));
    dispatch(setAwsSecret(awsSecretValue));
    router.push("/create-cluster/region");
  };

  // changes the aws id stored in state
  const idChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setAwsIdValue(event.currentTarget.value);
  };

  // changes the aws secret stored in state
  const secretChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setAwsSecretValue(event.currentTarget.value);
  };

  // sets state to previous page
  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/create-cluster/provider");
  };

  return (
    <Card.Root variant={"outlined"} className="p-6">
      <Card.Header className="mb-8 h-full">
        <Heading.Root className="p-0">
          <Heading.Headlines
            headline="AWS Credentials"
            subhead="Please enter your AWS credentials below to connect your account."
          />
        </Heading.Root>
      </Card.Header>
      <Card.Media>
        <div className="form-control w-full ">
          <form
            id="aws-form"
            onSubmit={onSubmitHandler}
            className="flex w-full flex-col "
          >
            <Label htmlFor="aws-form" className="mb-2 ">
              AWS Id
            </Label>
            <Input onChange={idChangeHandler} type="text" placeholder="Id" />
            <div className="mt-6">
              <Label htmlFor="aws-form" className="mb-2  ">
                AWS Secret
              </Label>
              <Input
                onChange={secretChangeHandler}
                type="text"
                placeholder="Secret"
              />
            </div>
            <p className="mt-8 inline max-w-prose flex-wrap text-sm text-muted-foreground">
              For more info visit:{" "}
            </p>
            <Link
              className="inline max-w-prose flex-wrap text-sm text-muted-foreground underline"
              href="https://docs.aws.amazon.com/keyspaces/latest/devguide/access.credentials.html"
            >
              How to create and configure AWS credentials for Amazon Keyspaces
            </Link>
            <div className="mt-8  flex  flex-col-reverse justify-between gap-2 md:flex-row">
              <Button onClick={backHandler} variant={"ghost"} className="">
                <ArrowLeftIcon className="h-4 w-4" /> Back
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </Card.Media>
    </Card.Root>
  );
}

export { AwsSecrets };
