import {
  ArrowRight,
  Book,
  Calendar,
  Clock,
  DollarSign,
  Moon,
  Sun,
  Users,
} from "lucide-react";
import React from "react";
import Axios from "../../../../utils/Axios";
import MonthlyStatistics from "./MonthlyStatistics";
import OverdueReminders from "./OverdueReminders";
import QuickLinks from "./QuickLinks";
import RecentActivities from "./RecentActivites";
import TopBorrowedBooks from "./TopBorrowedBooks";

const LibraryDashboard: React.FC = () => {

  // Demo data
  const [stats, setStats] = React.useState({
    totalBooks: 0,
    totalPatrons: 0,
    totalFines: 0,
    overdueBooks: 0,
    booksIssuedToday: 0,
  });

  React.useEffect(() => {
    Axios.get("/dashboard/stats").then((response) => {
      setStats(response.data);
    });
  }, []);

  const libraryStatus = {
    isOpen: true,
    openingHours: "8:00 AM - 6:00 PM",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Library Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome to {libraryStatus.isOpen ? "an open" : "a closed"} library
              day!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Calendar className="text-gray-600" size={20} />
            <span className="text-gray-600">March 23, 2025</span>
            {libraryStatus.isOpen ? (
              <Sun className="text-yellow-500" size={20} />
            ) : (
              <Moon className="text-gray-500" size={20} />
            )}
            <span className="text-sm text-gray-600">
              {libraryStatus.openingHours}
            </span>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-200">
            <Book className="text-indigo-600" size={32} />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalBooks.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-200">
            <Users className="text-indigo-600" size={32} />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patrons</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPatrons.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-200">
            <DollarSign className="text-indigo-600" size={32} />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fines</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.totalFines.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-200">
            <Clock className="text-indigo-600" size={32} />
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.overdueBooks}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-200">
            <ArrowRight className="text-indigo-600" size={32} />
            <div>
              <p className="text-sm font-medium text-gray-600">
                Books Issued Today
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.booksIssuedToday}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <RecentActivities />

          {/* Quick Links */}
         <QuickLinks/>

          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Borrowed Books */}
            <TopBorrowedBooks />

            {/* Overdue Reminders */}
            <OverdueReminders />
          </div>

          {/* Monthly Statistics Chart Placeholder */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
            <MonthlyStatistics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;
