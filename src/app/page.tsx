"use client";

import React, { useState, useEffect } from "react";
import WorldMap from "@/component/map/WorldMap";
import LatencyChart from "@/component/ui/LatencyChart";
import { useLatency } from "@/context/LatencyContext";
import { FaBars } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";
import ControlPanel from "@/component/ui/ControlPanel";

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
          {(showPanel || !isMobile) && <ControlPanel />}

          <LatencyChartSection />
        </div>

        <div className="w-full md:w-1/2 h-screen  relative z-0">
          <WorldMap />
        </div>
      </main>
    </div>
  );
};

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
