// src/components/BarChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define types for props
interface BarChartProps {
  labels: string[]; // Labels for the x-axis
  data: number[]; // Data points for the y-axis
  options?: Partial<ChartOptions>; // Optional custom chart options
}

// Define types for Chart.js options
interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: "top" | "bottom" | "left" | "right";
      labels: {
        font: {
          size: number;
          weight: string;
        };
        color: string;
      };
    };
    tooltip: {
      enabled: boolean;
      mode: "index" | "nearest" | "point" | "dataset";
      intersect: boolean;
      backgroundColor: string;
      titleColor: string;
      bodyColor: string;
      borderColor: string;
      borderWidth: number;
    };
  };
  scales: {
    x: {
      grid: {
        color: string;
      };
      ticks: {
        color: string;
        font: {
          size: number;
        };
      };
    };
    y: {
      beginAtZero: boolean;
      grid: {
        color: string;
      };
      ticks: {
        color: string;
        font: {
          size: number;
        };
      };
    };
  };
  animation: {
    duration: number;
    easing: "linear" | "easeInQuad" | "easeOutQuad" | "easeInOutQuad";
  };
}

const BarChart: React.FC<BarChartProps> = ({ labels, data, options }) => {
  // Define chart data structure
  const chartData = {
    labels,
    datasets: [
      {
        label: "Registered land per region",
        data,
        backgroundColor: "rgba(25, 118, 210, 0.6)", // Semi-transparent bar color
        borderColor: "#1976D2", // Border color for bars
        borderWidth: 1,
        borderRadius: 4, // Rounded corners for bars
        hoverBackgroundColor: "#1976D2", // Highlight color on hover
        hoverBorderColor: "#fff", // White border on hover
        hoverBorderWidth: 2, // Thicker border on hover
      },
    ],
  };

  // Default chart options with type safety
  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top", // Position the legend at the top
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#fff", // White text for dark theme
        },
      },
      tooltip: {
        enabled: true,
        mode: "index", // Show tooltips for all datasets at the hovered point
        intersect: false,
        backgroundColor: "#1E1E1E", // Dark background for tooltips
        titleColor: "#fff", // White title text
        bodyColor: "#fff", // White body text
        borderColor: "#3A3A3A", // Tooltip border color
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
        ticks: {
          color: "#fff", // White axis labels
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
        ticks: {
          color: "#fff", // White axis labels
          font: {
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 1000, // Smooth animation duration
      easing: "easeInOutQuad", // Smooth easing effect
    },
  };

  return <Bar data={chartData} options={{ ...defaultOptions, ...options }} />;
};

export default BarChart;
