"use client";

import React, { useState, useMemo } from "react";
import { useLatency } from "@/context/LatencyContext";
import MetricCard from "./MetricCard";
import { Exchange } from "@/types";

const ControlPanel: React.FC = () => {
  const {
    exchanges,
    cloudRegions,
    selectedExchange,
    selectedRegion,
    selectExchange,
    selectRegion,
    timeRange,
    setTimeRange,
    latencyStats,
    visibleProviders,
    toggleProviderVisibility,
  } = useLatency();

  const [exchangeSearch, setExchangeSearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");

  const filteredExchanges = useMemo(() => {
    return exchanges.filter(
      (ex) =>
        ex.name.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
        ex.countryCode.toLowerCase().includes(exchangeSearch.toLowerCase())
    );
  }, [exchanges, exchangeSearch]);

  const filteredRegions = useMemo(() => {
    return cloudRegions.filter(
      (region) =>
        region.regionCode.toLowerCase().includes(regionSearch.toLowerCase()) ||
        region.countryCode.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [cloudRegions, regionSearch]);

  return (
    <div className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg px-4 py-4 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="w-full lg:w-1/2 space-y-6">
          {!selectedExchange && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Select Exchange
              </h3>
              <input
                type="text"
                placeholder="Search exchanges..."
                value={exchangeSearch}
                onChange={(e) => setExchangeSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {filteredExchanges.map((exchange: Exchange) => (
                  <div
                    key={exchange.id}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => selectExchange(exchange.id)}
                    title={`${exchange.name} - ${exchange.countryCode}`}
                  >
                    <span className="font-medium">{exchange.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      {exchange.provider.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedExchange && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Select Cloud Region
                </h3>
                <button
                  onClick={() => {
                    selectExchange(null);
                    selectRegion(null);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Change Exchange
                </button>
              </div>
              <input
                type="text"
                placeholder="Search regions..."
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {filteredRegions.map((region) => (
                  <div
                    key={region.id}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all text-sm ${
                      selectedRegion === region.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => selectRegion(region.id)}
                    title={`${region.regionCode} - ${region.countryCode} (${region.serverCount} servers)`}
                  >
                    <span className="font-medium">{region.regionCode}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedRegion === region.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {region.provider.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          {selectedExchange && selectedRegion && latencyStats ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                Latency Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  title="Current"
                  value={`${latencyStats.current}ms`}
                />
                <MetricCard title="Average" value={`${latencyStats.avg}ms`} />
                <MetricCard title="Minimum" value={`${latencyStats.min}ms`} />
                <MetricCard title="Maximum" value={`${latencyStats.max}ms`} />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {!selectedExchange
                  ? "Select an exchange to continue"
                  : "Select a cloud region to view latency metrics"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Time Range
          </h3>
          <div className="flex gap-2">
            {["1h", "24h", "7d", "30d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  timeRange === range
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Cloud Providers
          </h3>
          <div className="flex gap-2 flex-wrap">
            {["aws", "gcp", "azure"].map((provider) => (
              <button
                key={provider}
                onClick={() => toggleProviderVisibility(provider)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                  visibleProviders.includes(provider)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
                }`}
              >
                {provider.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
