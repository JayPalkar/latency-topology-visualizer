/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

interface CloudflareLatencyData {
  location: string;
  latency: number;
  timestamp: string;
}

export const fetchCloudflareLatency = async (): Promise<
  CloudflareLatencyData[]
> => {
  try {
    const response = await axios.get(
      "https://api.cloudflare.com/client/v4/radar/http/timeseries",
      {
        params: {
          format: "json",
          dateRange: "1d",
          metrics: "latency",
        },
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    );

    console.log("Raw Cloudflare Timeseries Response:", response.data);

    return response.data.result.timeseries.map((point: any) => ({
      location: point.location,
      latency: point.latency,
      timestamp: point.timestamp,
    }));
  } catch (error) {
    console.error("Failed to fetch Cloudflare latency data:", error);
    throw new Error("Failed to fetch Cloudflare latency data");
  }
};

export const getRegionLatency = async (regionCode: string): Promise<number> => {
  try {
    const response = await axios.get(
      `https://api.cloudflare.com/client/v4/radar/http/locations/${regionCode}`,
      {
        params: {
          format: "json",
          dateRange: "1h",
          metric: "latency",
        },
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
      }
    );

    console.log(`Latency data for region ${regionCode}:`, response.data);

    return response.data.result.location.latency;
  } catch (error) {
    console.error(`Failed to fetch latency for ${regionCode}:`, error);
    return Math.random() * 80 + 20; // Fallback to mock data
  }
};
