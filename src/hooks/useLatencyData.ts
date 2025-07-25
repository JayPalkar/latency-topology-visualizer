import { calculateDistance } from "@/utils/geoUtils";
import {
  Exchange,
  CloudRegion,
  LatencyData,
  HistoricalLatency,
  LatencyStats,
} from "../types";
import { fetchCloudflareLatency } from "@/utils/cloudflareApi";

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

export const fetchRealTimeData = async (
  useRealData: boolean
): Promise<{
  exchanges: Exchange[];
  regions: CloudRegion[];
  latency: LatencyData[];
}> => {
  let baseGlobalLatency = 50;

  if (useRealData) {
    try {
      baseGlobalLatency = await fetchCloudflareLatency();
      baseGlobalLatency *= 150;
    } catch (error) {
      console.error("Using mock data due to API error:", error);
      useRealData = false;
    }
  }

  const exchanges = MOCK_EXCHANGES.map((ex) => ({
    ...ex,
    latency: baseGlobalLatency * getCountryFactor(ex.countryCode),
  }));

  const regions = MOCK_REGIONS.map((reg) => ({
    ...reg,
    latency: baseGlobalLatency * getCountryFactor(reg.countryCode),
  }));

  await new Promise((resolve) => setTimeout(resolve, 800));

  const latency: LatencyData[] = [];
  exchanges.forEach((from) => {
    regions.forEach((to) => {
      const distance = calculateDistance(
        from.location[1], // lat
        from.location[0], // lon
        to.location[1],
        to.location[0]
      );

      // Simulate latency based on base latency, distance, and noise
      const simulatedLatency = Math.max(
        10,
        baseGlobalLatency * (0.8 + distance / 20000) + Math.random() * 20 - 10
      );

      latency.push({
        from: from.id,
        to: to.id,
        latency: simulatedLatency,
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
  try {
    const baseLatency = await fetchCloudflareLatency();

    const points =
      range === "1h" ? 12 : range === "24h" ? 24 : range === "7d" ? 7 : 30;

    const interval =
      range === "1h" ? 300000 : range === "24h" ? 3600000 : 86400000;

    const historical: HistoricalLatency[] = [];
    let min = Infinity,
      max = -Infinity,
      sum = 0;

    const now = Date.now();

    for (let i = 0; i < points; i++) {
      const timeVariation = Math.sin((i / points) * Math.PI) * 0.2;
      const randomVariation = Math.random() * 0.3 - 0.15;
      const latency = baseLatency * (1 + timeVariation + randomVariation);

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
  } catch (error) {
    console.error("Using mock historical data due to error:", error);

    return mockHistoricalData(exchangeId, regionId, range);
  }
};

function mockHistoricalData(
  exchangeId: string,
  regionId: string,
  range: string
) {
  const points =
    range === "1h" ? 12 : range === "24h" ? 24 : range === "7d" ? 7 : 30;

  const historical: HistoricalLatency[] = [];
  let min = Infinity,
    max = -Infinity,
    sum = 0;

  for (let i = 0; i < points; i++) {
    const latency = 50 + Math.random() * 50; // 50-100ms
    min = Math.min(min, latency);
    max = Math.max(max, latency);
    sum += latency;

    historical.push({
      timestamp: Date.now() - (points - i - 1) * 60000,
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
}

// Country → Latency Factor Map

function getCountryFactor(countryCode: string): number {
  const factors: Record<string, number> = {
    SG: 0.9,
    HK: 0.95,
    NL: 1.0,
    US: 1.1,
    DE: 1.2,
  };
  return factors[countryCode] || 1.0;
}
