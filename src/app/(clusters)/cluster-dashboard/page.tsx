"use client";
import React from "react";
import { Tabs, Box, Text } from "@radix-ui/themes";
import { Button } from "@/components/ui";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import ClusterCard from "./cluster-card";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import LoadingCard from "./loading-card";

const ClustersDashboard = () => {
  const router = useRouter();
  const usersClusters = api.cluster.getClusters.useQuery();
  return (
    <div className="mt-24">
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        <Box px="4" pt="3" pb="2">
          <Tabs.Content value="overview" className="flex flex-col gap-6">
            <div className="flex w-full items-end justify-end">
              <Button
                size={"sm"}
                onClick={() => router.push("/create-cluster/provider")}
              >
                <PlusCircledIcon className="mr-2" />
                New Cluster
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
              {usersClusters.data ? (
                usersClusters.data.map((cluster) => (
                  <ClusterCard
                    cluster={cluster}
                    name={cluster.name}
                    status={cluster.lifeCycleStage!}
                    key={cluster.name}
                  />
                ))
              ) : (
                <>
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                  <LoadingCard />
                </>
              )}
            </div>
          </Tabs.Content>

          <Tabs.Content value="settings">
            <Text size="2">
              Edit your profile or update contact information.
            </Text>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
};

export default ClustersDashboard;
