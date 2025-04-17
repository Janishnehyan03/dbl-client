import {
    Book,
    Clock,
    Download,
    Filter,
    Search
} from "lucide-react";
import React, { useState } from "react";

const ReportsPage: React.FC = () => {
  // Sample data for reports
  const [reports, setReports] = useState([
    {
      id: 1,
      bookTitle: "The Great Gatsby",
      borrower: "John Doe",
      borrowedDate: "2023-10-01",
      dueDate: "2023-10-15",
      status: "Overdue",
      fine: 2.5,
    },
    {
      id: 2,
      bookTitle: "To Kill a Mockingbird",
      borrower: "Jane Smith",
      borrowedDate: "2023-10-05",
      dueDate: "2023-10-19",
      status: "On Time",
      fine: 0,
    },
    {
      id: 3,
      bookTitle: "1984",
      borrower: "Alice Johnson",
      borrowedDate: "2023-09-28",
      dueDate: "2023-10-12",
      status: "Returned",
      fine: 0,
    },
  ]);

  // State for filters
  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "all",
    sortBy: "borrowedDate",
  });

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Filtered reports based on filters
  const filteredReports = reports.filter((report) => {
    const matchesSearchQuery = report.bookTitle.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      report.borrower.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesStatus = filters.status === "all" || report.status === filters.status;

    return matchesSearchQuery && matchesStatus;
  });

  // Sort reports
  const sortedReports = filteredReports.sort((a, b) => {
    if (filters.sortBy === "borrowedDate") {
      return new Date(a.borrowedDate).getTime() - new Date(b.borrowedDate).getTime();
    } else if (filters.sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (filters.sortBy === "fine") {
      return a.fine - b.fine;
    }
    return 0;
  });

  return (
    <div className="flex min-h-screen bg-gray-100 p-8">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Book className="mr-3 text-indigo-600" size={32} />
            Library Reports
          </h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-all duration-200">
            <Download className="mr-2" size={20} />
            Export Report
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Search className="mr-2 text-indigo-600" size={20} />
                Search
              </label>
              <input
                type="text"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder="Search by book or borrower"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Filter className="mr-2 text-indigo-600" size={20} />
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="On Time">On Time</option>
                <option value="Overdue">Overdue</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="mr-2 text-indigo-600" size={20} />
                Sort By
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="borrowedDate">Borrowed Date</option>
                <option value="dueDate">Due Date</option>
                <option value="fine">Fine Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Book Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Borrower</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Borrowed Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Fine ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-all duration-200">
                  <td className="px-6 py-4 text-sm text-gray-700">{report.bookTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{report.borrower}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{report.borrowedDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{report.dueDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === "Overdue"
                          ? "bg-red-100 text-red-700"
                          : report.status === "Returned"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">${report.fine.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;