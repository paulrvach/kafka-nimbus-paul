export const PanelsArray = (msk: string) => [
  {
    collapsed: false,
    datasource: {
      type: "prometheus",
    },
    gridPos: {
      h: 1,
      w: 24,
      x: 0,
      y: 0,
    },
    id: 28,
    panels: [],
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        refId: "A",
      },
    ],
    title: "Critical Values",
    type: "row",
  },
  {
    fieldConfig: {
      defaults: {
        color: {
          mode: "thresholds",
        },
        mappings: [
          {
            options: {
              match: "null",
              result: {
                text: "N/A",
              },
            },
            type: "special",
          },
        ],
        thresholds: {
          mode: "absolute",
          steps: [
            {
              color: "#299c46",
              value: null,
            },
            {
              color: "#F2495C",
              value: 1,
            },
            {
              color: "#C4162A",
              value: 1,
            },
          ],
        },
        unit: "none",
      },
      overrides: [],
    },
    gridPos: {
      h: 4,
      w: 3,
      x: 0,
      y: 1,
    },
    id: 17,
    links: [],
    maxDataPoints: 100,
    options: {
      colorMode: "background",
      graphMode: "area",
      justifyMode: "auto",
      orientation: "horizontal",
      reduceOptions: {
        calcs: ["max"],
        fields: "",
        values: false,
      },
      textMode: "auto",
    },
    pluginVersion: "8.4.7",
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        exemplar: true,
        expr: `sum(kafka_controller_KafkaController_Value{name=\"OfflinePartitionsCount\",job=\"msk\"}) without (instance)`,
        interval: "",
        legendFormat: "",
        refId: "A",
      },
    ],
    title: "Offline Partitions",
    type: "stat",
  },
  {
    fieldConfig: {
      defaults: {
        color: {
          mode: "thresholds",
        },
        mappings: [
          {
            options: {
              match: "null",
              result: {
                text: "N/A",
              },
            },
            type: "special",
          },
        ],
        thresholds: {
          mode: "absolute",
          steps: [
            {
              color: "#299c46",
              value: null,
            },
            {
              color: "rgba(237, 129, 40, 0.89)",
              value: 1,
            },
            {
              color: "#d44a3a",
            },
          ],
        },
        unit: "none",
      },
      overrides: [],
    },
    gridPos: {
      h: 4,
      w: 3,
      x: 3,
      y: 1,
    },
    id: 15,
    links: [],
    maxDataPoints: 100,
    options: {
      colorMode: "background",
      graphMode: "area",
      justifyMode: "auto",
      orientation: "horizontal",
      reduceOptions: {
        calcs: ["mean"],
        fields: "",
        values: false,
      },
      textMode: "auto",
    },
    pluginVersion: "8.4.7",
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(rate(kafka_controller_ControllerStats_Count{name=\"IsrChangeRateAndTimeMs\", job=\"msk\"}[30m])) without (instance)`,
        refId: "A",
      },
    ],
    title: "In-Sync Replica state change",
    type: "stat",
  },
  {
    fieldConfig: {
      defaults: {
        color: {
          mode: "thresholds",
        },
        mappings: [
          {
            options: {
              match: "null",
              result: {
                text: "N/A",
              },
            },
            type: "special",
          },
        ],
        thresholds: {
          mode: "absolute",
          steps: [
            {
              color: "#299c46",
              value: null,
            },
            {
              color: "#F2495C",
              value: 10,
            },
            {
              color: "#C4162A",
              value: 50,
            },
          ],
        },
        unit: "none",
      },
      overrides: [],
    },
    gridPos: {
      h: 4,
      w: 3,
      x: 6,
      y: 1,
    },
    id: 18,
    links: [],
    maxDataPoints: 100,
    options: {
      colorMode: "background",
      graphMode: "area",
      justifyMode: "auto",
      orientation: "horizontal",
      reduceOptions: {
        calcs: ["lastNotNull"],
        fields: "",
        values: false,
      },
      textMode: "auto",
    },
    pluginVersion: "8.4.7",
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `max(kafka_log_LogFlushStats_Count{name=\"LogFlushRateAndTimeMs\", job=\"msk\"}) without (instance)`,
        legendFormat: "{{instance}}",
        refId: "A",
      },
    ],
    title: "Log Flush Latency (ms)",
    type: "stat",
  },
  {
    datasource: {
      type: "prometheus",
    },
    fieldConfig: {
      defaults: {
        color: {
          fixedColor: "rgb(31, 120, 193)",
          mode: "fixed",
        },
        mappings: [
          {
            options: {
              match: "null",
              result: {
                text: "N/A",
              },
            },
            type: "special",
          },
        ],
        thresholds: {
          mode: "absolute",
          steps: [
            {
              color: "green",
              value: null,
            },
            {
              color: "red",
              value: 80,
            },
          ],
        },
        unit: "none",
      },
      overrides: [],
    },
    gridPos: {
      h: 4,
      w: 3,
      x: 12,
      y: 1,
    },
    id: 19,
    links: [],
    maxDataPoints: 100,
    options: {
      colorMode: "none",
      graphMode: "area",
      justifyMode: "auto",
      orientation: "horizontal",
      reduceOptions: {
        calcs: ["max"],
        fields: "",
        values: false,
      },
      textMode: "auto",
    },
    pluginVersion: "8.4.7",
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        exemplar: true,
        expr: `sum(kafka_controller_KafkaController_Value{name=\"GlobalTopicCount\", job=\"msk\"}) without (instance)`,
        interval: "",
        legendFormat: "",
        refId: "A",
      },
    ],
    title: "Total Topics",
    type: "stat",
  },
  {
    fieldConfig: {
      defaults: {
        color: {
          fixedColor: "rgb(31, 120, 193)",
          mode: "fixed",
        },
        mappings: [
          {
            options: {
              match: "null",
              result: {
                text: "N/A",
              },
            },
            type: "special",
          },
        ],
        thresholds: {
          mode: "absolute",
          steps: [
            {
              color: "green",
              value: null,
            },
            {
              color: "red",
              value: 80,
            },
          ],
        },
        unit: "none",
      },
      overrides: [],
    },
    gridPos: {
      h: 4,
      w: 3,
      x: 15,
      y: 1,
    },
    id: 20,
    links: [],
    maxDataPoints: 100,
    options: {
      colorMode: "none",
      graphMode: "area",
      justifyMode: "auto",
      orientation: "horizontal",
      reduceOptions: {
        calcs: ["max"],
        fields: "",
        values: false,
      },
      textMode: "auto",
    },
    pluginVersion: "8.4.7",
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(kafka_controller_KafkaController_Value{name=\"PreferredReplicaImbalanceCount\", job=\"msk\"}) without (instance)`,
        refId: "A",
      },
    ],
    title: "Preferred Leader Imbalance",
    type: "stat",
  },
  {
    fieldConfig: {
      defaults: {
        color: {
          fixedColor: "rgb(31, 120, 193)",
          mode: "fixed",
        },
        mappings: [
          {
            options: {
              match: "null",
              result: {
                text: "N/A",
              },
            },
            type: "special",
          },
        ],
        thresholds: {
          mode: "absolute",
          steps: [
            {
              color: "green",
              value: null,
            },
            {
              color: "red",
              value: 80,
            },
          ],
        },
        unit: "none",
      },
      overrides: [],
    },
    gridPos: {
      h: 4,
      w: 3,
      x: 18,
      y: 1,
    },
    id: 14,
    links: [],
    maxDataPoints: 100,
    options: {
      colorMode: "none",
      graphMode: "area",
      justifyMode: "auto",
      orientation: "horizontal",
      reduceOptions: {
        calcs: ["max"],
        fields: "",
        values: false,
      },
      textMode: "auto",
    },
    pluginVersion: "8.4.7",
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(kafka_controller_KafkaController_Value{name=\"GlobalPartitionCount\", job=\"msk\"}) without (instance)`,
        refId: "A",
      },
    ],
    title: "Total Partitions",
    type: "stat",
  },
  {
    fieldConfig: {
      defaults: {
        color: {
          fixedColor: "rgb(31, 120, 193)",
          mode: "fixed",
        },
        mappings: [
          {
            options: {
              match: "null",
              result: {
                text: "N/A",
              },
            },
            type: "special",
          },
        ],
        thresholds: {
          mode: "absolute",
          steps: [
            {
              color: "green",
              value: null,
            },
            {
              color: "red",
              value: 80,
            },
          ],
        },
        unit: "none",
      },
      overrides: [],
    },
    gridPos: {
      h: 4,
      w: 3,
      x: 21,
      y: 1,
    },
    id: 25,
    links: [],
    maxDataPoints: 100,
    options: {
      colorMode: "none",
      graphMode: "area",
      justifyMode: "auto",
      orientation: "horizontal",
      reduceOptions: {
        calcs: ["max"],
        fields: "",
        values: false,
      },
      textMode: "auto",
    },
    pluginVersion: "8.4.7",
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(kafka_server_Fetch_queue_size, job=\"msk\") without (instance)`,
        refId: "A",
      },
    ],
    title: "Fetch Queue Size",
    type: "stat",
  },
  {
    aliasColors: {},
    bars: false,
    dashLength: 10,
    dashes: false,
    fieldConfig: {
      defaults: {
        links: [],
      },
      overrides: [],
    },
    fill: 1,
    fillGradient: 0,
    gridPos: {
      h: 7,
      w: 24,
      x: 0,
      y: 5,
    },
    hiddenSeries: false,
    id: 2,
    legend: {
      avg: false,
      current: false,
      max: false,
      min: false,
      show: true,
      total: false,
      values: false,
    },
    lines: true,
    linewidth: 1,
    nullPointMode: "null",
    options: {
      alertThreshold: true,
    },
    percentage: false,
    pluginVersion: "8.4.7",
    pointradius: 2,
    points: false,
    renderer: "flot",
    seriesOverrides: [],
    spaceLength: 10,
    stack: true,
    steppedLine: false,
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(kafka_server_BrokerTopicMetrics_OneMinuteRate{name=\"MessagesInPerSec\", job=\"msk\"}) by (instance)`,
        legendFormat: "{{instance}}",
        refId: "A",
      },
    ],
    thresholds: [],
    timeRegions: [],
    title: "MessagesInPerSec",
    tooltip: {
      shared: true,
      sort: 0,
      value_type: "individual",
    },
    type: "graph",
    xaxis: {
      mode: "time",
      show: true,
      values: [],
    },
    yaxes: [
      {
        format: "short",
        logBase: 1,
        show: true,
      },
      {
        format: "short",
        logBase: 1,
        show: true,
      },
    ],
    yaxis: {
      align: false,
    },
  },
  {
    collapsed: false,
    datasource: {
      type: "prometheus",
    },
    gridPos: {
      h: 1,
      w: 24,
      x: 0,
      y: 12,
    },
    id: 10,
    panels: [],
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        refId: "A",
      },
    ],
    title: "Cluster Traffic",
    type: "row",
  },
  {
    aliasColors: {},
    bars: false,
    dashLength: 10,
    dashes: false,
    fieldConfig: {
      defaults: {
        links: [],
      },
      overrides: [],
    },
    fill: 1,
    fillGradient: 0,
    gridPos: {
      h: 8,
      w: 12,
      x: 0,
      y: 13,
    },
    hiddenSeries: false,
    id: 8,
    legend: {
      avg: false,
      current: false,
      max: false,
      min: false,
      show: true,
      total: false,
      values: false,
    },
    lines: true,
    linewidth: 1,
    nullPointMode: "null",
    options: {
      alertThreshold: true,
    },
    percentage: false,
    pluginVersion: "8.4.7",
    pointradius: 2,
    points: false,
    renderer: "flot",
    seriesOverrides: [],
    spaceLength: 10,
    stack: true,
    steppedLine: false,
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(kafka_server_BrokerTopicMetrics_OneMinuteRate{job=\"jmx\",name=\"ReplicationBytesInPerSec\", job=\"msk\"}) by (instance)`,
        legendFormat: "{{instance}}",
        refId: "A",
      },
    ],
    thresholds: [],
    timeRegions: [],
    title: "ReplicationBytesInPerSec",
    tooltip: {
      shared: true,
      sort: 0,
      value_type: "individual",
    },
    type: "graph",
    xaxis: {
      mode: "time",
      show: true,
      values: [],
    },
    yaxes: [
      {
        format: "short",
        logBase: 1,
        show: true,
      },
      {
        format: "short",
        logBase: 1,
        show: true,
      },
    ],
    yaxis: {
      align: false,
    },
  },
  {
    aliasColors: {},
    bars: false,
    dashLength: 10,
    dashes: false,
    fieldConfig: {
      defaults: {
        links: [],
      },
      overrides: [],
    },
    fill: 1,
    fillGradient: 0,
    gridPos: {
      h: 8,
      w: 12,
      x: 12,
      y: 13,
    },
    hiddenSeries: false,
    id: 7,
    legend: {
      avg: false,
      current: false,
      max: false,
      min: false,
      show: true,
      total: false,
      values: false,
    },
    lines: true,
    linewidth: 1,
    nullPointMode: "null",
    options: {
      alertThreshold: true,
    },
    percentage: false,
    pluginVersion: "8.4.7",
    pointradius: 2,
    points: false,
    renderer: "flot",
    seriesOverrides: [],
    spaceLength: 10,
    stack: true,
    steppedLine: false,
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(kafka_server_BrokerTopicMetrics_OneMinuteRate{job=\"jmx\",name=\"ReplicationBytesOutPerSec\", job=\"msk\"}) by (instance)`,
        legendFormat: "{{instance}}",
        refId: "A",
      },
    ],
    thresholds: [],
    timeRegions: [],
    title: "ReplicationBytesOutPerSec",
    tooltip: {
      shared: true,
      sort: 0,
      value_type: "individual",
    },
    type: "graph",
    xaxis: {
      mode: "time",
      show: true,
      values: [],
    },
    yaxes: [
      {
        format: "short",
        logBase: 1,
        show: true,
      },
      {
        format: "short",
        logBase: 1,
        show: true,
      },
    ],
    yaxis: {
      align: false,
    },
  },
  {
    aliasColors: {},
    bars: false,
    dashLength: 10,
    dashes: false,
    fieldConfig: {
      defaults: {
        links: [],
      },
      overrides: [],
    },
    fill: 1,
    fillGradient: 0,
    gridPos: {
      h: 8,
      w: 12,
      x: 0,
      y: 21,
    },
    hiddenSeries: false,
    id: 6,
    legend: {
      avg: false,
      current: false,
      max: false,
      min: false,
      show: true,
      total: false,
      values: false,
    },
    lines: true,
    linewidth: 1,
    nullPointMode: "null",
    options: {
      alertThreshold: true,
    },
    percentage: false,
    pluginVersion: "8.4.7",
    pointradius: 2,
    points: false,
    renderer: "flot",
    seriesOverrides: [],
    spaceLength: 10,
    stack: true,
    steppedLine: false,
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(kafka_server_BrokerTopicMetrics_OneMinuteRate{job=\"jmx\",name=\"TotalProduceRequestsPerSec\", job=\"msk\"}) by (instance)`,
        legendFormat: "{{instance}}",
        refId: "A",
      },
    ],
    thresholds: [],
    timeRegions: [],
    title: "TotalProduceRequestsPerSec",
    tooltip: {
      shared: true,
      sort: 0,
      value_type: "individual",
    },
    type: "graph",
    xaxis: {
      mode: "time",
      show: true,
      values: [],
    },
    yaxes: [
      {
        format: "short",
        logBase: 1,
        show: true,
      },
      {
        format: "short",
        logBase: 1,
        show: true,
      },
    ],
    yaxis: {
      align: false,
    },
  },
  {
    aliasColors: {},
    bars: false,
    dashLength: 10,
    dashes: false,
    fieldConfig: {
      defaults: {
        links: [],
      },
      overrides: [],
    },
    fill: 1,
    fillGradient: 0,
    gridPos: {
      h: 8,
      w: 12,
      x: 12,
      y: 21,
    },
    hiddenSeries: false,
    id: 31,
    legend: {
      avg: false,
      current: false,
      max: false,
      min: false,
      show: true,
      total: false,
      values: false,
    },
    lines: true,
    linewidth: 1,
    nullPointMode: "null",
    options: {
      alertThreshold: true,
    },
    percentage: false,
    pluginVersion: "8.4.7",
    pointradius: 2,
    points: false,
    renderer: "flot",
    seriesOverrides: [],
    spaceLength: 10,
    stack: true,
    steppedLine: false,
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `sum(kafka_cluster_Partition_Value{name=\"UnderReplicated\", job=\"msk\"}) by (topic)`,
        legendFormat: "{{topic}}",
        refId: "A",
      },
    ],
    thresholds: [],
    timeRegions: [],
    title: "Under replicated partitions by Topic",
    tooltip: {
      shared: true,
      sort: 0,
      value_type: "individual",
    },
    type: "graph",
    xaxis: {
      mode: "time",
      show: true,
      values: [],
    },
    yaxes: [
      {
        format: "short",
        logBase: 1,
        show: true,
      },
      {
        format: "short",
        logBase: 1,
        show: true,
      },
    ],
    yaxis: {
      align: false,
    },
  },
  {
    aliasColors: {},
    bars: false,
    dashLength: 10,
    dashes: false,
    fieldConfig: {
      defaults: {
        links: [],
      },
      overrides: [],
    },
    fill: 1,
    fillGradient: 0,
    gridPos: {
      h: 8,
      w: 12,
      x: 0,
      y: 29,
    },
    hiddenSeries: false,
    id: 32,
    legend: {
      avg: false,
      current: false,
      max: false,
      min: false,
      show: true,
      total: false,
      values: false,
    },
    lines: true,
    linewidth: 1,
    nullPointMode: "null",
    options: {
      alertThreshold: true,
    },
    percentage: false,
    pluginVersion: "8.4.7",
    pointradius: 2,
    points: false,
    renderer: "flot",
    seriesOverrides: [],
    spaceLength: 10,
    stack: true,
    steppedLine: false,
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        expr: `kafka_server_SessionExpireListener_OneMinuteRate{name=\"ZooKeeperDisconnectsPerSec\", job=\"msk\"}`,
        legendFormat: "{{instance}}",
        refId: "A",
      },
    ],
    thresholds: [],
    timeRegions: [],
    title: "ZooKeeperDisconnectsPerSec",
    tooltip: {
      shared: true,
      sort: 0,
      value_type: "individual",
    },
    type: "graph",
    xaxis: {
      mode: "time",
      show: true,
      values: [],
    },
    yaxes: [
      {
        format: "short",
        logBase: 1,
        show: true,
      },
      {
        format: "short",
        logBase: 1,
        show: true,
      },
    ],
    yaxis: {
      align: false,
    },
  },
  {
    collapsed: true,
    datasource: {
      type: "prometheus",
    },
    gridPos: {
      h: 1,
      w: 24,
      x: 0,
      y: 37,
    },
    id: 30,
    panels: [
      {
        aliasColors: {},
        bars: false,
        dashLength: 10,
        dashes: false,
        decimals: 1,
        fieldConfig: {
          defaults: {
            links: [],
          },
          overrides: [],
        },
        fill: 1,
        fillGradient: 0,
        gridPos: {
          h: 7,
          w: 12,
          x: 0,
          y: 3,
        },
        hiddenSeries: false,
        id: 12,
        legend: {
          alignAsTable: true,
          avg: true,
          current: true,
          max: true,
          min: true,
          show: true,
          total: false,
          values: true,
        },
        lines: true,
        linewidth: 1,
        nullPointMode: "null",
        options: {
          alertThreshold: true,
        },
        percentage: false,
        pluginVersion: "8.4.7",
        pointradius: 2,
        points: false,
        renderer: "flot",
        seriesOverrides: [
          {
            alias: "Out",
            transform: "negative-Y",
          },
        ],
        spaceLength: 10,
        stack: false,
        steppedLine: false,
        targets: [
          {
            datasource: {
              type: "prometheus",
            },
            expr: `sum(rate(kafka_server_BrokerTopicMetrics_Count{name=\"BytesInPerSec\",job=\"msk\"}[1m])) by (name)`,
            instant: false,
            interval: "10s",
            intervalFactor: 1,
            legendFormat: "In",
            refId: "A",
          },
          {
            datasource: {
              type: "prometheus",
            },
            expr: `sum(rate(kafka_server_BrokerTopicMetrics_Count{name=\"BytesOutPerSec\",job=\"msk\"}[1m])) by (name)`,
            instant: false,
            interval: "10s",
            legendFormat: "Out",
            refId: "B",
          },
        ],
        thresholds: [],
        timeRegions: [],
        title: "Network Bytes",
        tooltip: {
          shared: true,
          sort: 0,
          value_type: "individual",
        },
        type: "graph",
        xaxis: {
          mode: "time",
          show: true,
          values: [],
        },
        yaxes: [
          {
            format: "Bps",
            logBase: 1,
            show: true,
          },
          {
            format: "short",
            logBase: 1,
            show: false,
          },
        ],
        yaxis: {
          align: false,
        },
      },
      {
        aliasColors: {},
        bars: false,
        dashLength: 10,
        dashes: false,
        fieldConfig: {
          defaults: {
            links: [],
          },
          overrides: [],
        },
        fill: 1,
        fillGradient: 0,
        gridPos: {
          h: 7,
          w: 12,
          x: 12,
          y: 3,
        },
        hiddenSeries: false,
        id: 22,
        legend: {
          avg: false,
          current: false,
          max: false,
          min: false,
          show: true,
          total: false,
          values: false,
        },
        lines: true,
        linewidth: 1,
        nullPointMode: "null",
        options: {
          alertThreshold: true,
        },
        percentage: false,
        pluginVersion: "8.4.7",
        pointradius: 2,
        points: false,
        renderer: "flot",
        seriesOverrides: [],
        spaceLength: 10,
        stack: false,
        steppedLine: false,
        targets: [
          {
            datasource: {
              type: "prometheus",
            },
            expr: `sum(kafka_network_RequestMetrics_OneMinuteRate{name=\"RequestsPerSec\",job=\"msk\"  }) by (instance)`,
            legendFormat: "{{instance}}",
            refId: "A",
          },
        ],
        thresholds: [],
        timeRegions: [],
        title: "Network: RequestsPerSec",
        tooltip: {
          shared: true,
          sort: 0,
          value_type: "individual",
        },
        type: "graph",
        xaxis: {
          mode: "time",
          show: true,
          values: [],
        },
        yaxes: [
          {
            format: "short",
            logBase: 1,
            show: true,
          },
          {
            format: "short",
            logBase: 1,
            show: true,
          },
        ],
        yaxis: {
          align: false,
        },
      },
      {
        aliasColors: {},
        bars: false,
        dashLength: 10,
        dashes: false,
        fieldConfig: {
          defaults: {
            links: [],
          },
          overrides: [],
        },
        fill: 1,
        fillGradient: 0,
        gridPos: {
          h: 5,
          w: 12,
          x: 0,
          y: 10,
        },
        hiddenSeries: false,
        id: 26,
        legend: {
          alignAsTable: true,
          avg: false,
          current: true,
          max: false,
          min: true,
          show: true,
          total: false,
          values: true,
        },
        lines: true,
        linewidth: 1,
        nullPointMode: "null",
        options: {
          alertThreshold: true,
        },
        percentage: false,
        pluginVersion: "8.4.7",
        pointradius: 2,
        points: false,
        renderer: "flot",
        seriesOverrides: [],
        spaceLength: 10,
        stack: false,
        steppedLine: false,
        targets: [
          {
            datasource: {
              type: "prometheus",
            },
            expr: `sum(kafka_network_Processor_Value{name=\"IdlePercent\", job=\"msk\"}) by (instance)`,
            legendFormat: "{{instance}}",
            refId: "A",
          },
        ],
        thresholds: [],
        timeRegions: [],
        title: "Network: CPU Idle Time",
        tooltip: {
          shared: true,
          sort: 0,
          value_type: "individual",
        },
        type: "graph",
        xaxis: {
          mode: "time",
          show: true,
          values: [],
        },
        yaxes: [
          {
            format: "percentunit",
            logBase: 1,
            show: true,
          },
          {
            format: "short",
            logBase: 1,
            show: true,
          },
        ],
        yaxis: {
          align: false,
        },
      },
      {
        aliasColors: {},
        bars: false,
        dashLength: 10,
        dashes: false,
        fieldConfig: {
          defaults: {
            links: [],
          },
          overrides: [],
        },
        fill: 1,
        fillGradient: 0,
        gridPos: {
          h: 5,
          w: 12,
          x: 12,
          y: 10,
        },
        hiddenSeries: false,
        id: 23,
        legend: {
          avg: false,
          current: false,
          max: false,
          min: false,
          show: true,
          total: false,
          values: false,
        },
        lines: true,
        linewidth: 1,
        nullPointMode: "null",
        options: {
          alertThreshold: true,
        },
        percentage: false,
        pluginVersion: "8.4.7",
        pointradius: 2,
        points: false,
        renderer: "flot",
        seriesOverrides: [],
        spaceLength: 10,
        stack: false,
        steppedLine: false,
        targets: [
          {
            datasource: {
              type: "prometheus",
            },
            expr: `sum(kafka_network_RequestMetrics_OneMinuteRate{name=\"ErrorsPerSec\",job=\"msk\"  }) by (instance)`,
            legendFormat: "{{instance}}",
            refId: "A",
          },
        ],
        thresholds: [],
        timeRegions: [],
        title: "Network: ErrorsPerSec",
        tooltip: {
          shared: true,
          sort: 0,
          value_type: "individual",
        },
        type: "graph",
        xaxis: {
          mode: "time",
          show: true,
          values: [],
        },
        yaxes: [
          {
            format: "short",
            logBase: 1,
            show: true,
          },
          {
            format: "short",
            logBase: 1,
            show: true,
          },
        ],
        yaxis: {
          align: false,
        },
      },
    ],
    targets: [
      {
        datasource: {
          type: "prometheus",
        },
        refId: "A",
      },
    ],
    title: "Networking",
    type: "row",
  },
];
