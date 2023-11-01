import React from "react";
import { useMetricsContext } from "~/app/_context/metrics-ctx";
import { topicsColumns } from "./topics-columns";
import { DataTable } from "~/app/_components/data-table";
import CreateTopicModal from "./create-topic-modal";




const Topics = ({ clusterId }: { clusterId: string }) => {
  const {
    clusterMetrics: { topics, metrics },
  } = useMetricsContext();
  return (
    <div>
      <CreateTopicModal clusterId={clusterId} />
      <DataTable
        columns={topicsColumns}
        data={topics}
        searchBy="name"
      />
    </div>
  );
};

export default Topics;
