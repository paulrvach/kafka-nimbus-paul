import React from "react";
import { useMetricsContext } from "~/app/_context/metrics-ctx";
import { DataTable } from "~/app/_components/data-table";
import { consumerColumns } from "./consumer-columns";
const Consumers = () => {
  const {
    clusterMetrics: { consumerGroups },
  } = useMetricsContext();
  return (
    <div>
      <DataTable columns={consumerColumns} data={consumerGroups} searchBy="groupId"/>
    </div>
  );
};

export default Consumers;
