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

const LatencyContext = createContext<LatencyContextType | undefined>(undefined);

export const useLatency = () => {
  const context = useContext(LatencyContext);
  if (!context) {
    throw new Error("useLatency must be used within a LatencyProvider");
  }
  return context;
};

export const LatencyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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

  const refreshData = async () => {
    setLoading(true);
    try {
      const { exchanges, regions, latency } = await fetchRealTimeData();
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

  const selectExchange = (id: string | null) => {
    setSelectedExchange(id);
    if (id && selectedRegion) {
      fetchHistorical(id, selectedRegion, timeRange);
    }
  };

  const selectRegion = (id: string | null) => {
    setSelectedRegion(id);
    if (selectedExchange && id) {
      fetchHistorical(selectedExchange, id, timeRange);
    }
  };

  const setTimeRange = (range: string) => {
    setTimeRangeState(range);
    if (selectedExchange && selectedRegion) {
      fetchHistorical(selectedExchange, selectedRegion, range);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [useRealData]);

  const toggleDataSource = () => setUseRealData(!useRealData);

  const toggleProviderVisibility = (provider: string) => {
    setVisibleProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

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
