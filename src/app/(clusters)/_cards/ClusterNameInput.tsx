"use client";
import React, { useState } from "react";
import { useAppDispatch } from "~/app/_redux/hooks";
import { setClusterName } from "~/app/_redux/slices/createClusterSlice";
import { Button, Heading, Card, Input, Label } from "@/components/ui";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

function ClusterNameInput() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [name, setName] = useState("");

  // changes name stored in state
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Submits the name into redux state
  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setClusterName(name));
    router.push("/create-cluster/size");
  };

  // sets state to previous page
  const backHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/create-cluster/region");
  };

  return (
    <Card.Root variant={"outlined"} className="max-w-1/3 p-6">
      <Card.Header className="mb-8 h-full">
        <Heading.Root className="p-0">
          <Heading.Headlines
            headline="Cluster Name"
            subhead="How the cluster will be identified in console."
          />
        </Heading.Root>
      </Card.Header>
      <Card.Media className="flex flex-col gap-3">
        <form onSubmit={onSubmitHandler} className="w-full">
          <div className="mb-8 flex flex-col gap-2">
            <Label className="">Name</Label>
            <Input
              type="text"
              placeholder="my-cluster"
              onChange={onChangeHandler}
            />
            <p className="text-sm text-muted-foreground">
              Must be all lowercase with no speacial characters.
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

export { ClusterNameInput };
