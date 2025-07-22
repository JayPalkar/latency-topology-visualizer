"use client";

import React from "react";

const Header: React.FC = () => {
  return (
    <header className="relative z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm p-2 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-blue-600 mr-3"></div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Latency Topology Visualizer
        </h1>
      </div>
    </header>
  );
};

export default Header;
