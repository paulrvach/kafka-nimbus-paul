"use client";
import {
  useState,
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type Metrics = {
  ClusterName: string;
  CreationTimeString: string;
  KafkaVersion: string;
  NumberOfBrokerNodes: number;
  State: string;
  metricsDashboard: unknown;
  bootStrapServer: [];
  cluster: {
    BrokerNodeGroupInfo: {
      StorageInfo: {
        EbsStorageInfo: {
          VolumeSize: { EbsStorageInfo: { VolumeSize: string } };
        };
      };
    };
  };
  kafkaArn: string;
  instanceSize: string;
};

export type Partitions = {
  partitionErrorCode: number;
  partitionId: number;
  leader: number;
  isr: unknown[];
  offlineReplicas: unknown[];
};

export type Topics = unknown[];
export type ConsumerGroups = Array<{
  groupId: string;
  protocol: string;
  state: string;
  members: string[];
  subscribedTopics: string[];
}>;

export type ClusterMetrics = {
  metrics?: Metrics;
  topics?: Topics;
  consumerGroups?: ConsumerGroups;
};

interface ContextProps {
  clusterMetrics: ClusterMetrics;
  setClusterMetrics: Dispatch<SetStateAction<ClusterMetrics>>;
}

export const defaultClusterMetrics: ClusterMetrics = {
  metrics: {
    ClusterName: "",
    CreationTimeString: "",
    KafkaVersion: "",
    NumberOfBrokerNodes: 0,
    State: "",
    metricsDashboard: null,
    bootStrapServer: [],
    cluster: {
      BrokerNodeGroupInfo: {
        StorageInfo: {
          EbsStorageInfo: {
            VolumeSize: { EbsStorageInfo: { VolumeSize: "" } },
          },
        },
      },
    },
    instanceSize: "",
    kafkaArn: "",
  },
  topics: [],
  consumerGroups: [
    {
      groupId: "",
      members: [""],
      protocol: "",
      state: "",
      subscribedTopics: [""],
    },
  ],
};

const MetricsContext = createContext<ContextProps>({
  clusterMetrics: defaultClusterMetrics,
  setClusterMetrics: () => defaultClusterMetrics,
});

export interface MetricsContextProviderProps {
  children: React.ReactNode;
  initClusterMetrics: ClusterMetrics;
}

const MetricsContextProvider = ({
  children,
  initClusterMetrics,
}: MetricsContextProviderProps) => {
  const [clusterMetrics, setClusterMetrics] =
    useState<ClusterMetrics>(initClusterMetrics);
  return (
    <MetricsContext.Provider value={{ clusterMetrics, setClusterMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
};

const useMetricsContext = () => useContext(MetricsContext);

export { MetricsContextProvider, useMetricsContext };
