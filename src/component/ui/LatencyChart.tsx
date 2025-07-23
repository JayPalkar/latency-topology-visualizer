/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { format } from "date-fns";
import { HistoricalLatency } from "@/types";
import { getLatencyColor } from "@/utils/colorUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LatencyChartProps {
  data: HistoricalLatency[];
  timeRange: string;
  exchangeId: string;
  regionId: string;
}

const LatencyChart: React.FC<LatencyChartProps> = ({
  data,
  timeRange,
  exchangeId,
  regionId,
}) => {
  // Format labels based on time range
  const labels = data.map((item) => {
    const date = new Date(item.timestamp);
    if (timeRange === "1h") return format(date, "HH:mm");
    if (timeRange === "24h") return format(date, "HH:00");
    return format(date, "MMM dd");
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Latency (ms)",
        data: data.map((item) => item.latency),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        pointBackgroundColor: data.map((item) => getLatencyColor(item.latency)),
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointRadius: 4,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context: any) => `Latency: ${context.parsed.y}ms`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: Math.max(...data.map((item) => item.latency)) * 1.2,
        title: {
          display: true,
          text: "ms",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LatencyChart;
