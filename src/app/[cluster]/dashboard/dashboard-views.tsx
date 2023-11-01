import React from "react";
import { Tabs, Box, Text } from "@radix-ui/themes";
import Metrics from "./metrics";
import Consumers from "./consumer/consumers";
import Topics from "./topics/topics";

const DashboardViews = ({clusterid}: {clusterid: string}) => {
  return (
    <Tabs.Root defaultValue="consumers">
      <Tabs.List>
        <Tabs.Trigger value="consumers">Consumers</Tabs.Trigger>
        <Tabs.Trigger value="metrics">Metrics</Tabs.Trigger>
        <Tabs.Trigger value="topics">Topics</Tabs.Trigger>
      </Tabs.List>

      <Box px="4" pt="3" pb="2">
        <Tabs.Content value="consumers">
          <Consumers />
        </Tabs.Content>
        <Tabs.Content value="metrics">
          <Metrics />
        </Tabs.Content>
        <Tabs.Content value="topics">
          <Topics clusterId={clusterid}/>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
};

export default DashboardViews;
