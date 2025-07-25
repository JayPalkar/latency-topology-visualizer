"use client";

import React, { useState, useEffect } from "react";
import WorldMap from "@/component/map/WorldMap";
import LatencyChart from "@/component/ui/LatencyChart";
import { useLatency } from "@/context/LatencyContext";
import { FaBars } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";
import ControlPanel from "@/component/ui/ControlPanel";

// Main landing page of the app, combining the control panel, latency chart, and 3D world map
const HomePage: React.FC = () => {
  const [showPanel, setShowPanel] = useState(false); // Controls visibility of sidebar panel on mobile
  const [isMobile, setIsMobile] = useState(false); // Checks if the screen size is mobile

  // Detect screen width changes to toggle mobile layout
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100  dark:from-gray-900 dark:to-gray-800">
      <main className="flex-grow flex flex-col lg:flex-row relative">
        {isMobile && (
          <div className="relative  top-2 z-30 flex gap-2 max-w-full">
            <button
              onClick={handleTogglePanel}
              className="bg-blue-600 text-white p-2 rounded-lg shadow-md"
            >
              {showPanel ? <MdOutlineClose /> : <FaBars />}
            </button>
          </div>
        )}

        <div className="w-full lg:w-1/2 p-4 space-y-6 overflow-y-auto relative z-10">
          {(showPanel || !isMobile) && <ControlPanel />}

          <LatencyChartSection />
        </div>

        <div className="w-full lg:w-1/2 h-[90vh] lg:h-screen  relative z-0">
          <WorldMap />
        </div>
      </main>
    </div>
  );
};

// Chart section showing latency history between selected exchange and region
const LatencyChartSection: React.FC = () => {
  const {
    historicalData,
    selectedExchange,
    selectedRegion,
    timeRange,
    loading,
  } = useLatency();

  // Only show chart if both exchange and region are selected
  if (!selectedExchange || !selectedRegion) {
    return;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-white font-bold">Latency History</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedExchange} → {selectedRegion}
        </div>
      </div>

      <LatencyChart
        data={historicalData}
        timeRange={timeRange}
        exchangeId={selectedExchange}
        regionId={selectedRegion}
        loading={loading}
      />
    </div>
  );
};

export default HomePage;
