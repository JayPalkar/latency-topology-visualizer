export type CloudProvider = "aws" | "gcp" | "azure";

export interface Exchange {
  id: string;
  name: string;
  location: [number, number]; // [long, lat]
  provider: CloudProvider;
  latency?: number;
  countryCode: string;
}

export interface CloudRegion {
  id: string;
  provider: CloudProvider;
  location: [number, number];
  regionCode: string;
  serverCount: number;
  countryCode: string;
}

export interface LatencyData {
  from: string;
  to: string;
  latency: number;
  timestamp: number;
}

export interface HistoricalLatency {
  timestamp: number;
  latency: number;
}

export interface LatencyStats {
  min: number;
  max: number;
  avg: number;
  current: number;
}
