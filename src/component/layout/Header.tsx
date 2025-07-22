"use client";

import React from "react";
import { useLatency } from "@/context/LatencyContext";

const Header: React.FC = () => {
  const { loading } = useLatency();

  return (
    <header className="relative z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 mr-3"></div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Latency Topology Visualizer
          </h1>
          {loading && (
            <div className="ml-4 px-2 py-1  text-yellow-800 rounded-full text-xs flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-600 mr-1 animate-pulse"></span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
