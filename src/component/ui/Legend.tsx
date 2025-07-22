import React from "react";

const Legend: React.FC = () => {
  return (
    <div className="absolute top-5 right-4 text-white  dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-4 z-10">
      <h3 className="font-bold mb-2 text-gray-800 text-white">Legend</h3>

      <div className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#FF9900] mr-2"></div>
          <span className="text-sm">AWS Exchange</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#4285F4] mr-2"></div>
          <span className="text-sm">GCP Exchange</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-[#0089D6] mr-2"></div>
          <span className="text-sm">Azure Exchange</span>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-[#FF9900] mr-2"></div>
          <span className="text-sm">AWS Region</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-[#4285F4] mr-2"></div>
          <span className="text-sm">GCP Region</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-[#0089D6] mr-2"></div>
          <span className="text-sm">Azure Region</span>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-[#4ade80] mr-2"></div>
          <span className="text-sm">Low Latency (&lt;50ms)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-[#facc15] mr-2"></div>
          <span className="text-sm">Medium Latency (50-100ms)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-[#f87171] mr-2"></div>
          <span className="text-sm">High Latency (&gt;100ms)</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
