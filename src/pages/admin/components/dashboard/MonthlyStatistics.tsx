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
  AlertTriangle,
  ArrowRight,
  BarChart2,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Axios from "../../../../utils/Axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: false }, // We use a custom header
  },
  scales: {
    x: { title: { display: true, text: "Day of Month" } },
    y: { title: { display: true, text: "Number of Books" }, beginAtZero: true },
  },
};

const MonthlyStatistics = () => {
  const [stats, setStats] = useState({
    month: "",
    dailyStats: [],
    totalBooksIssued: 0,
    totalBooksReturned: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getMonthlyStats = async (year: any, month: any) => {
    try {
      const response = await Axios.get("/dashboard/monthly-stats", {
        params: { year, month },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly statistics:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getMonthlyStats(
          new Date().getFullYear(),
          new Date().getMonth() + 1
        ); // Fetches for the current month by default
        if (!data || !data.dailyStats) {
          throw new Error("Invalid data format received from API.");
        }
        setStats(data);
      } catch (err) {
        setError("Could not load monthly statistics.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full h-96 flex justify-center items-center">
        <Loader className="animate-spin text-indigo-600 mr-3" size={32} />
        <p className="text-gray-600">Loading Statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl shadow-lg p-6 w-full h-96 flex justify-center items-center">
        <AlertTriangle className="text-red-500 mr-3" size={32} />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  // Prepare chart data from the fetched stats
  const chartData = {
    labels: stats.dailyStats.map((stat: any) => stat.date.slice(8, 10)),
    datasets: [
      {
        label: "Books Issued",
        data: stats.dailyStats.map((stat: any) => stat.issued),
        backgroundColor: "rgba(99, 102, 241, 0.7)",
      },
      {
        label: "Books Returned",
        data: stats.dailyStats.map((stat: any) => stat.returned),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart2 className="text-indigo-600 mr-2" size={24} />
        Monthly Statistics - {stats.month}
      </h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <ArrowRight className="text-indigo-600" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Books Issued
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalBooksIssued}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <CheckCircle className="text-green-600" size={28} />
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Books Returned
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalBooksReturned}
            </p>
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
