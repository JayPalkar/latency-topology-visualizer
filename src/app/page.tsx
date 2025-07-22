"use client";

import React from "react";
import WorldMap from "@/component/map/WorldMap";
import ControlPanel from "@/component/ui/ControlPanel";
import Legend from "@/component/ui/Legend";
import LatencyChart from "@/component/ui/LatencyChart";
import Header from "@/component/layout/Header";
import { useLatency } from "@/context/LatencyContext";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 z-0">
          <WorldMap />
        </div>

        <div className="relative  z-10">
          <ControlPanel />
          <Legend />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-t-xl shadow-2xl">
          <LatencyChartSection />
        </div>
      </main>
    </div>
  );
};

const LatencyChartSection: React.FC = () => {
  const { historicalData, selectedExchange, selectedRegion, timeRange } =
    useLatency();

  if (!selectedExchange || !selectedRegion) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Select an exchange and cloud region to view historical latency data
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Historical Latency</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedExchange} → {selectedRegion}
        </div>
      </div>

      <LatencyChart data={historicalData} timeRange={timeRange} />
    </div>
  );
};

export default HomePage;
