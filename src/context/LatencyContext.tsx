"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Exchange,
  CloudRegion,
  LatencyData,
  HistoricalLatency,
  LatencyStats,
} from "../types";
import {
  fetchRealTimeData,
  fetchHistoricalData,
} from "../hooks/useLatencyData";

// Define the context shape for type safety and IntelliSense support
interface LatencyContextType {
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  latencyData: LatencyData[];
  historicalData: HistoricalLatency[];
  loading: boolean;
  error: string | null;
  selectedExchange: string | null;
  selectedRegion: string | null;
  timeRange: string;
  latencyStats: LatencyStats | null;
  selectExchange: (id: string | null) => void;
  selectRegion: (id: string | null) => void;
  setTimeRange: (range: string) => void;
  refreshData: () => Promise<void>;
  fetchHistorical: (
    exchangeId: string,
    regionId: string,
    range: string
  ) => Promise<void>;
  visibleProviders: string[];
  toggleProviderVisibility: (provider: string) => void;
  useRealData: boolean;
  toggleDataSource: () => void;
}

// Create the context
const LatencyContext = createContext<LatencyContextType | undefined>(undefined);

// Custom hook to access the context easily
export const useLatency = () => {
  const context = useContext(LatencyContext);
  if (!context) {
    throw new Error("useLatency must be used within a LatencyProvider");
  }
  return context;
};

// Context provider to wrap around your app
export const LatencyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Global state definitions
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [cloudRegions, setCloudRegions] = useState<CloudRegion[]>([]);
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalLatency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [timeRange, setTimeRangeState] = useState<string>("24h");
  const [latencyStats, setLatencyStats] = useState<LatencyStats | null>(null);
  const [visibleProviders, setVisibleProviders] = useState<string[]>([
    "aws",
    "gcp",
    "azure",
  ]);
  const [useRealData, setUseRealData] = useState(false);

  // Fetch latest exchange/region/latency data
  const refreshData = async () => {
    setLoading(true);
    try {
      const { exchanges, regions, latency } = await fetchRealTimeData(
        useRealData
      );
      setExchanges(exchanges);
      setCloudRegions(regions);
      setLatencyData(latency);
      setError(null);
    } catch (err) {
      setError("Failed to fetch real-time data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch historical latency data for a given exchange/region/time range
  const fetchHistorical = async (
    exchangeId: string,
    regionId: string,
    range: string
  ) => {
    setLoading(true);
    try {
      const data = await fetchHistoricalData(exchangeId, regionId, range);
      setHistoricalData(data.historical);
      setLatencyStats(data.stats);
      setError(null);
    } catch (err) {
      setError("Failed to fetch historical data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update selected exchange and trigger historical data fetch if region is selected
  const selectExchange = (id: string | null) => {
    setSelectedExchange(id);
    if (id && selectedRegion) {
      fetchHistorical(id, selectedRegion, timeRange);
    }
  };

  // Update selected region and trigger historical data fetch if exchange is selected
  const selectRegion = (id: string | null) => {
    setSelectedRegion(id);
    if (selectedExchange && id) {
      fetchHistorical(selectedExchange, id, timeRange);
    }
  };

  // Set time range and refetch historical data
  const setTimeRange = (range: string) => {
    setTimeRangeState(range);
    if (selectedExchange && selectedRegion) {
      fetchHistorical(selectedExchange, selectedRegion, range);
    }
  };

  // Fetch real-time data initially and every 10s
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedExchange || !selectedRegion) return;

    fetchHistorical(selectedExchange, selectedRegion, timeRange);

    const interval = setInterval(() => {
      fetchHistorical(selectedExchange, selectedRegion, timeRange);
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedExchange, selectedRegion, timeRange]);

  const toggleDataSource = () => setUseRealData(!useRealData);

  // Show/hide cloud provider regions
  const toggleProviderVisibility = (provider: string) => {
    setVisibleProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  // Provide all state and handlers to children
  return (
    <LatencyContext.Provider
      value={{
        exchanges,
        cloudRegions,
        latencyData,
        historicalData,
        loading,
        error,
        selectedExchange,
        selectedRegion,
        timeRange,
        latencyStats,
        selectExchange,
        selectRegion,
        setTimeRange,
        refreshData,
        fetchHistorical,
        visibleProviders,
        toggleProviderVisibility,
        useRealData,
        toggleDataSource,
      }}
    >
      {children}
    </LatencyContext.Provider>
  );
};
