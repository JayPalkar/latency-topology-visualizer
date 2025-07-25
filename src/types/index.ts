// Define the supported cloud providers used throughout the application
export type CloudProvider = "aws" | "gcp" | "azure";

// Interface representing a financial exchange node on the map
export interface Exchange {
  id: string;
  name: string;
  location: [number, number]; // [long, lat]
  provider: CloudProvider;
  latency?: number;
  countryCode: string;
}

// Interface representing a cloud region (not an exchange) used for grouping or analysis
export interface CloudRegion {
  id: string;
  provider: CloudProvider;
  location: [number, number];
  regionCode: string;
  serverCount: number;
  countryCode: string;
}

// Represents a single latency measurement between two endpoints
export interface LatencyData {
  from: string;
  to: string;
  latency: number;
  timestamp: number;
}

// Time series data of historical latencies for a connection
export interface HistoricalLatency {
  timestamp: number;
  latency: number;
}

// Statistical summary of latency metrics
export interface LatencyStats {
  min: number;
  max: number;
  avg: number;
  current: number;
}
