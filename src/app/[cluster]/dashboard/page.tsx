"use client";
import React from "react";
import DashboardViews from "./dashboard-views";

const Dashboard = ({ params }: { params: { clusterId: string } }) => {
  return (
    <div className="mt-14">
      <DashboardViews clusterid={params.clusterId} />
    </div>
  );
};

export default Dashboard;
