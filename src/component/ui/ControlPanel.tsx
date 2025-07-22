"use client";

import React, { useState } from "react";
import { useLatency } from "@/context/LatencyContext";
import MetricCard from "./MetricCard";
import { IoMdRefresh } from "react-icons/io";

const ControlPanel: React.FC = () => {
  const {
    cloudRegions,
    loading,
    refreshData,
    selectedExchange,
    selectedRegion,
    selectRegion,
    timeRange,
    setTimeRange,
    latencyStats,
  } = useLatency();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegions = cloudRegions.filter((region) =>
    region.regionCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl p-4 w-80 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Latency Dashboard
        </h2>
        <button
          onClick={refreshData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm disabled:opacity-50"
        >
          <IoMdRefresh />
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search regions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-gray-300">
        Cloud Regions
      </h3>

      {!selectedExchange ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select an exchange on the map to view available regions.
        </p>
      ) : (
        <div className="space-y-2 mb-4">
          {filteredRegions.map((region) => (
            <div
              key={region.id}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedRegion === region.id
                  ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => selectRegion(region.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{region.regionCode}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600">
                  {region.provider.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Servers: {region.serverCount}
              </div>
            </div>
          ))}
        </div>
      )}

      {latencyStats && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Latency Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard title="Current" value={`${latencyStats.current}ms`} />
            <MetricCard title="Average" value={`${latencyStats.avg}ms`} />
            <MetricCard title="Minimum" value={`${latencyStats.min}ms`} />
            <MetricCard title="Maximum" value={`${latencyStats.max}ms`} />
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-bold mb-2">Time Range</h3>
        <div className="flex space-x-2">
          {["1h", "24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2 rounded-lg text-sm ${
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
    </div>
  );
};

export default ControlPanel;
