import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import {
    ArrowRight,
    BarChart2,
    CheckCircle
} from "lucide-react";
import React from "react";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyStatistics: React.FC = () => {
  // Demo data for March 2025 (replace with API fetch in a real app)
  const monthlyData = {
    month: "March 2025",
    totalBooksIssued: 450,
    totalBooksReturned: 420,
    dailyStats: [
      { date: "2025-03-01", issued: 15, returned: 12 },
      { date: "2025-03-02", issued: 18, returned: 15 },
      { date: "2025-03-03", issued: 20, returned: 18 },
      { date: "2025-03-04", issued: 12, returned: 10 },
      { date: "2025-03-05", issued: 16, returned: 14 },
      { date: "2025-03-06", issued: 22, returned: 20 },
      { date: "2025-03-07", issued: 25, returned: 23 },
      { date: "2025-03-08", issued: 14, returned: 12 },
      { date: "2025-03-09", issued: 17, returned: 15 },
      { date: "2025-03-10", issued: 19, returned: 17 },
      { date: "2025-03-11", issued: 13, returned: 11 },
      { date: "2025-03-12", issued: 21, returned: 19 },
      { date: "2025-03-13", issued: 23, returned: 21 },
      { date: "2025-03-14", issued: 15, returned: 13 },
      { date: "2025-03-15", issued: 18, returned: 16 },
      { date: "2025-03-16", issued: 20, returned: 18 },
      { date: "2025-03-17", issued: 14, returned: 12 },
      { date: "2025-03-18", issued: 16, returned: 14 },
      { date: "2025-03-19", issued: 22, returned: 20 },
      { date: "2025-03-20", issued: 24, returned: 22 },
      { date: "2025-03-21", issued: 17, returned: 15 },
      { date: "2025-03-22", issued: 19, returned: 17 },
      { date: "2025-03-23", issued: 23, returned: 21 }, // Current date
    ],
  };

  // Chart data
  const chartData = {
    labels: monthlyData.dailyStats.map((stat) => stat.date.slice(8, 10)), // Day of month (01-23)
    datasets: [
      {
        label: "Books Issued",
        data: monthlyData.dailyStats.map((stat) => stat.issued),
        backgroundColor: "rgba(99, 102, 241, 0.7)", // Indigo
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
      {
        label: "Books Returned",
        data: monthlyData.dailyStats.map((stat) => stat.returned),
        backgroundColor: "rgba(34, 197, 94, 0.7)", // Green
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Monthly Statistics - ${monthlyData.month}`,
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day of Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Books",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart2 className="text-indigo-600 mr-2" size={24} />
        Monthly Statistics - {monthlyData.month}
      </h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <ArrowRight className="text-indigo-600" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Books Issued</p>
            <p className="text-2xl font-bold text-gray-900">{monthlyData.totalBooksIssued}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <CheckCircle className="text-green-600" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-600">Total Books Returned</p>
            <p className="text-2xl font-bold text-gray-900">{monthlyData.totalBooksReturned}</p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-96">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MonthlyStatistics;