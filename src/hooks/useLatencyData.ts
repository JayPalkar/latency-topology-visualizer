import {
  Exchange,
  CloudRegion,
  LatencyData,
  HistoricalLatency,
  LatencyStats,
} from "../types";

// Mock data for demonstration
const MOCK_EXCHANGES: Exchange[] = [
  { id: "binance", name: "Binance", location: [103.85, 1.28], provider: "aws" },
  { id: "okx", name: "OKX", location: [114.16, 22.28], provider: "aws" },
  { id: "deribit", name: "Deribit", location: [4.89, 52.37], provider: "gcp" },
  { id: "bybit", name: "Bybit", location: [103.85, 1.28], provider: "azure" },
  { id: "kraken", name: "Kraken", location: [-122.33, 47.61], provider: "gcp" },
  {
    id: "coinbase",
    name: "Coinbase",
    location: [-122.42, 37.77],
    provider: "aws",
  },
];

const MOCK_REGIONS: CloudRegion[] = [
  {
    id: "aws-sg",
    provider: "aws",
    location: [103.85, 1.28],
    regionCode: "ap-southeast-1",
    serverCount: 12,
  },
  {
    id: "gcp-nl",
    provider: "gcp",
    location: [4.89, 52.37],
    regionCode: "europe-west4",
    serverCount: 8,
  },
  {
    id: "azure-sg",
    provider: "azure",
    location: [114.16, 22.28],
    regionCode: "southeastasia",
    serverCount: 7,
  },
  {
    id: "aws-usw",
    provider: "aws",
    location: [-122.33, 47.61],
    regionCode: "us-west-2",
    serverCount: 15,
  },
  {
    id: "gcp-usw",
    provider: "gcp",
    location: [-122.42, 37.77],
    regionCode: "us-west2",
    serverCount: 10,
  },
  {
    id: "azure-eur",
    provider: "azure",
    location: [8.68, 50.11],
    regionCode: "germanywestcentral",
    serverCount: 9,
  },
];

export const fetchRealTimeData = async (): Promise<{
  exchanges: Exchange[];
  regions: CloudRegion[];
  latency: LatencyData[];
}> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const latency: LatencyData[] = [];
  MOCK_EXCHANGES.forEach((from) => {
    MOCK_REGIONS.forEach((to) => {
      latency.push({
        from: from.id,
        to: to.id,
        latency: Math.random() * 80 + 20,
        timestamp: Date.now(),
      });
    });
  });

  return {
    exchanges: MOCK_EXCHANGES,
    regions: MOCK_REGIONS,
    latency,
  };
};

export const fetchHistoricalData = async (
  exchangeId: string,
  regionId: string,
  range: string
): Promise<{
  historical: HistoricalLatency[];
  stats: LatencyStats;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const now = Date.now();
  const points =
    range === "1h" ? 60 : range === "24h" ? 24 : range === "7d" ? 7 : 30;

  const interval =
    range === "1h" ? 60000 : range === "24h" ? 3600000 : 86400000;

  const historical: HistoricalLatency[] = [];
  let min = Infinity,
    max = -Infinity,
    sum = 0;

  for (let i = 0; i < points; i++) {
    const latency = Math.random() * 50 + 30;
    min = Math.min(min, latency);
    max = Math.max(max, latency);
    sum += latency;

    historical.push({
      timestamp: now - (points - i - 1) * interval,
      latency,
    });
  }

  const current = historical[historical.length - 1].latency;

  return {
    historical,
    stats: {
      min: parseFloat(min.toFixed(1)),
      max: parseFloat(max.toFixed(1)),
      avg: parseFloat((sum / points).toFixed(1)),
      current: parseFloat(current.toFixed(1)),
    },
  };
};
