import React from "react";

const Legend: React.FC = () => {
  return (
    <div className="absolute bottom-2 right-0  text-white sm:text-sm  bg-gray-800/90 border-2 border-gray-700 backdrop-blur-sm rounded-xl shadow-lg p-4 z-10">
      <h3 className="font-bold mb-2  text-white">Legend</h3>

      <div className="flex gap-5 space-y-2">
        <div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#0000ff] mr-2"></div>
            <span className="text-sm">AWS Exchange</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#f000f0] mr-2"></div>
            <span className="text-sm">GCP Exchange</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#ff0000] mr-2"></div>
            <span className="text-sm">Azure Exchange</span>
          </div>
        </div>

        <div>
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
    </div>
  );
};

export default Legend;
