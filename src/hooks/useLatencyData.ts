import { calculateDistance } from "@/utils/geoUtils";
import {
  Exchange,
  CloudRegion,
  LatencyData,
  HistoricalLatency,
  LatencyStats,
} from "../types";
import {
  fetchCloudflareLatency,
  getRegionLatency,
} from "@/utils/cloudflareApi";

// Mock data for demonstration
const MOCK_EXCHANGES: Exchange[] = [
  {
    id: "binance",
    name: "Binance",
    location: [103.85, 1.28],
    provider: "aws",
    countryCode: "SG",
  },
  {
    id: "okx",
    name: "OKX",
    location: [114.16, 22.28],
    provider: "aws",
    countryCode: "HK",
  },
  {
    id: "deribit",
    name: "Deribit",
    location: [4.89, 52.37],
    provider: "gcp",
    countryCode: "NL",
  },
  {
    id: "bybit",
    name: "Bybit",
    location: [103.85, 1.28],
    provider: "azure",
    countryCode: "SG",
  },
  {
    id: "kraken",
    name: "Kraken",
    location: [-122.33, 47.61],
    provider: "gcp",
    countryCode: "US",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    location: [-122.42, 37.77],
    provider: "aws",
    countryCode: "US",
  },
];

const MOCK_REGIONS: CloudRegion[] = [
  {
    id: "aws-sg",
    provider: "aws",
    location: [103.85, 1.28],
    regionCode: "ap-southeast-1",
    serverCount: 12,
    countryCode: "SG",
  },
  {
    id: "gcp-nl",
    provider: "gcp",
    location: [4.89, 52.37],
    regionCode: "europe-west4",
    serverCount: 8,
    countryCode: "NL",
  },
  {
    id: "azure-sg",
    provider: "azure",
    location: [114.16, 22.28],
    regionCode: "southeastasia",
    serverCount: 7,
    countryCode: "HK",
  },
  {
    id: "aws-usw",
    provider: "aws",
    location: [-122.33, 47.61],
    regionCode: "us-west-2",
    serverCount: 15,
    countryCode: "US",
  },
  {
    id: "gcp-usw",
    provider: "gcp",
    location: [-122.42, 37.77],
    regionCode: "us-west2",
    serverCount: 10,
    countryCode: "US",
  },
  {
    id: "azure-eur",
    provider: "azure",
    location: [8.68, 50.11],
    regionCode: "germanywestcentral",
    serverCount: 9,
    countryCode: "DE",
  },
];

export const fetchRealTimeData = async (): Promise<{
  exchanges: Exchange[];
  regions: CloudRegion[];
  latency: LatencyData[];
}> => {
  const useRealData = process.env.NEXT_PUBLIC_USE_REAL_DATA === "true";

  if (useRealData) {
    try {
      const cloudflareData = await fetchCloudflareLatency();

      const exchanges = MOCK_EXCHANGES.map((ex) => ({
        ...ex,
        latency:
          cloudflareData.find((d) => d.location === ex.countryCode)?.latency ||
          50,
      }));

      const regions = await Promise.all(
        MOCK_REGIONS.map(async (reg) => ({
          ...reg,
          latency: await getRegionLatency(reg.countryCode),
        }))
      );

      const latency: LatencyData[] = [];
      exchanges.forEach((from) => {
        regions.forEach((to) => {
          const baseLatency = Math.abs(
            (from.latency || 50) - (to.latency || 50)
          );
          const distanceFactor =
            calculateDistance(
              from.location[1],
              from.location[0],
              to.location[1],
              to.location[0]
            ) / 10000;

          latency.push({
            from: from.id,
            to: to.id,
            latency: baseLatency * (0.8 + distanceFactor * 0.4),
            timestamp: Date.now(),
          });
        });
      });

      return { exchanges, regions, latency };
    } catch (error) {
      console.error("Using mock data due to API error:", error);
    }
  }

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
