import {
  AlertTriangle,
  ArrowRight,
  Book,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Moon,
  Sun,
  Users
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import MonthlyStatistics from "./MonthlyStatistics";

const LibraryDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Demo data
  const stats = {
    totalBooks: 12500,
    totalPatrons: 3200,
    totalFines: 245.75,
    overdueBooks: 47,
    booksIssuedToday: 23,
  };

  const recentActivities = [
    {
      id: "1",
      action: "Book Issued",
      details: "The Great Gatsby issued to John Doe",
      timestamp: "2025-03-23 09:15 AM",
    },
    {
      id: "2",
      action: "Fine Paid",
      details: "Jane Smith paid $3.50 for Physics 101",
      timestamp: "2025-03-22 03:45 PM",
    },
    {
      id: "3",
      action: "Book Returned",
      details: "Harry Potter returned by Alice Brown",
      timestamp: "2025-03-22 11:20 AM",
    },
  ];

  const quickLinks = [
    {
      text: "Add New Book",
      path: "/catalog/books/new",
      icon: <Book size={20} />,
    },
    {
      text: "Issue Books",
      path: "/circulation/issue",
      icon: <ArrowRight size={20} />,
    },
    { text: "View Fines", path: "/fines", icon: <DollarSign size={20} /> },
    { text: "Manage Patrons", path: "/patrons", icon: <Users size={20} /> },
  ];

  const topBorrowedBooks = [
    { title: "To Kill a Mockingbird", borrows: 120 },
    { title: "1984", borrows: 95 },
    { title: "Pride and Prejudice", borrows: 87 },
  ];

  const overdueReminders = [
    {
      id: "1",
      patron: "Mike Ross",
      book: "Chemistry 101",
      dueDate: "2025-03-20",
    },
    { id: "2", patron: "Sara Lee", book: "The Hobbit", dueDate: "2025-03-21" },
  ];

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
                ${stats.totalFines.toFixed(2)}
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
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activities
            </h2>
            {recentActivities.length === 0 ? (
              <p className="text-gray-600">No recent activities.</p>
            ) : (
              <ul className="space-y-4">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-start space-x-3">
                    <CheckCircle className="text-green-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.details}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="flex items-center w-full p-2 text-left text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span className="font-medium">{link.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Borrowed Books */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top Borrowed Books
            </h2>
            <ul className="space-y-3">
              {topBorrowedBooks.map((book, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{book.title}</span>
                  <span className="text-sm font-medium text-indigo-600">
                    {book.borrows} borrows
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Overdue Reminders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="text-red-500 mr-2" size={20} />
              Overdue Reminders
            </h2>
            {overdueReminders.length === 0 ? (
              <p className="text-gray-600">No overdue books.</p>
            ) : (
              <ul className="space-y-3">
                {overdueReminders.map((reminder) => (
                  <li key={reminder.id} className="text-sm text-gray-600">
                    <span className="font-medium">{reminder.patron}</span> -{" "}
                    {reminder.book} (Due: {reminder.dueDate})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Monthly Statistics Chart Placeholder */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
            <MonthlyStatistics />
          </div>
        </div>

        {/* Additional Widgets */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Fine Collection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Monthly Fine Collection
            </h2>
            <p className="text-2xl font-bold text-green-600">$152.30</p>
            <p className="text-sm text-gray-600">Collected in March 2025</p>
          </div>

          {/* New Patrons This Month */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              New Patrons This Month
            </h2>
            <p className="text-2xl font-bold text-indigo-600">85</p>
            <p className="text-sm text-gray-600">Added in March 2025</p>
          </div>

          {/* Books Reserved */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Books Reserved
            </h2>
            <p className="text-2xl font-bold text-orange-600">12</p>
            <p className="text-sm text-gray-600">Pending pickups</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;
