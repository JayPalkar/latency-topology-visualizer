import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend }) => {
  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    return trend > 0 ? "text-red-500" : "text-green-500";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? "↑" : "↓";
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="flex items-center mt-1">
        <div className="text-xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className={`ml-2 text-sm ${getTrendColor()}`}>
            {getTrendIcon()} {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
