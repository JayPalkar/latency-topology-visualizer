"use client";

import React, { useState } from "react";
import { useLatency } from "@/context/LatencyContext";
import MetricCard from "./MetricCard";

const ControlPanel: React.FC = () => {
  const {
    cloudRegions,
    selectedExchange,
    selectedRegion,
    selectRegion,
    timeRange,
    setTimeRange,
    latencyStats,
    visibleProviders,
    toggleProviderVisibility,
  } = useLatency();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegions = cloudRegions.filter((region) =>
    region.regionCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg px-4 py-4 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="w-full lg:w-1/2 space-y-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Cloud Regions
          </h2>
          {!selectedExchange ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select an exchange on the globe to view regions.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => selectRegion(region.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    selectedRegion === region.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {region.regionCode} ({region.provider.toUpperCase()})
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedExchange && latencyStats && (
          <div className="w-full lg:w-1/2 space-y-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              MetricCard Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <MetricCard title="Current" value={`${latencyStats.current}ms`} />
              <MetricCard title="Average" value={`${latencyStats.avg}ms`} />
              <MetricCard title="Minimum" value={`${latencyStats.min}ms`} />
              <MetricCard title="Maximum" value={`${latencyStats.max}ms`} />
            </div>
          </div>
        )}
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
          <h3 className="font-bold text-gray-700 dark:text-gray-300">
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
