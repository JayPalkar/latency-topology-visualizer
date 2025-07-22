"use client";

import React, { useState, useEffect } from "react";
import WorldMap from "@/component/map/WorldMap";
import LatencyChart from "@/component/ui/LatencyChart";
import { useLatency } from "@/context/LatencyContext";
import { FaBars } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";

const HomePage: React.FC = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTogglePanel = () => {
    setShowPanel((prev) => {
      return !prev;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-grow flex flex-col md:flex-row relative">
        {isMobile && (
          <div className="relative left-4 top-2 z-30 flex gap-2">
            <button
              onClick={handleTogglePanel}
              className="bg-blue-600 text-white p-2 rounded-lg shadow-md"
            >
              {showPanel ? <MdOutlineClose /> : <FaBars />}
            </button>
          </div>
        )}

        <div className="w-full md:w-1/2 p-4 space-y-6 overflow-y-auto relative z-10">
          {(showPanel || !isMobile) && <HorizontalControlPanel />}

          <LatencyChartSection />
        </div>

        <div className="w-full md:w-1/2 h-screen  relative z-0">
          <WorldMap />
        </div>
      </main>
    </div>
  );
};

const HorizontalControlPanel: React.FC = () => {
  const {
    cloudRegions,
    selectedExchange,
    selectedRegion,
    selectRegion,
    timeRange,
    setTimeRange,
    latencyStats,
  } = useLatency();

  return (
    <div className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-lg px-4 py-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
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
            {cloudRegions.map((region) => (
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

      {latencyStats && (
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300">
            Latency Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Metric title="Current" value={`${latencyStats.current}ms`} />
            <Metric title="Average" value={`${latencyStats.avg}ms`} />
            <Metric title="Minimum" value={`${latencyStats.min}ms`} />
            <Metric title="Maximum" value={`${latencyStats.max}ms`} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
          Time Range
        </h3>
        <div className="flex space-x-2">
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
    </div>
  );
};

const Metric: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <div className="flex flex-col">
    <span className="font-medium text-gray-600 dark:text-gray-300">
      {title}
    </span>
    <span className="text-gray-800 dark:text-white">{value}</span>
  </div>
);

const LatencyChartSection: React.FC = () => {
  const { historicalData, selectedExchange, selectedRegion, timeRange } =
    useLatency();

  if (!selectedExchange || !selectedRegion) {
    return;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl">
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
