import { AlertCircle, CheckCircle, DollarSign, Download } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FinesPage: React.FC = () => {
  const navigate = useNavigate();

  // Sample initial fines data (replace with API fetch in a real app)
  const [fines, setFines] = useState([
    {
      id: "1",
      userId: "U001",
      userName: "John Doe",
      bookTitle: "The Great Gatsby",
      fineAmount: 5.0,
      issueDate: "2025-02-01",
      dueDate: "2025-03-01",
      status: "Unpaid",
      paymentDate: null,
      paymentAmount: 0,
    },
    {
      id: "2",
      userId: "U002",
      userName: "Jane Smith",
      bookTitle: "Physics 101",
      fineAmount: 3.5,
      issueDate: "2025-02-15",
      dueDate: "2025-03-15",
      status: "Paid",
      paymentDate: "2025-03-10",
      paymentAmount: 3.5,
    },
  ]);

  const [filterMonth, setFilterMonth] = useState(
    new Date().toISOString().slice(0, 7)
  ); // Default to current month (YYYY-MM)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Filter fines by month
  const filteredFines = fines.filter((fine) =>
    fine.issueDate.startsWith(filterMonth)
  );

  console.log("Filtered Fines:", loading);

  // Calculate payment collection summary
  const paymentSummary = filteredFines.reduce(
    (acc, fine) => {
      acc.totalFines += fine.fineAmount;
      acc.totalCollected += fine.status === "Paid" ? fine.paymentAmount : 0;
      acc.totalPending += fine.status === "Unpaid" ? fine.fineAmount : 0;
      return acc;
    },
    { totalFines: 0, totalCollected: 0, totalPending: 0 }
  );

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterMonth(e.target.value);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "User ID",
      "User Name",
      "Book Title",
      "Fine Amount",
      "Issue Date",
      "Due Date",
      "Status",
      "Payment Date",
      "Payment Amount",
    ];
    const rows = filteredFines.map((fine) => [
      fine.id,
      fine.userId,
      fine.userName,
      fine.bookTitle,
      fine.fineAmount,
      fine.issueDate,
      fine.dueDate,
      fine.status,
      fine.paymentDate || "N/A",
      fine.paymentAmount,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `fines_${filterMonth}.csv`;
    link.click();
  };

  const markAsPaid = (id: string) => {
    if (window.confirm("Mark this fine as paid?")) {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        setFines((prev) =>
          prev.map((fine) =>
            fine.id === id
              ? {
                  ...fine,
                  status: "Paid",
                  paymentDate: new Date().toISOString().slice(0, 10),
                  paymentAmount: fine.fineAmount,
                }
              : fine
          )
        );
        setSuccess(true);
        setLoading(false);
        setTimeout(() => setSuccess(false), 2000);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DollarSign className="mr-3 text-indigo-600" size={32} />
            Fines
          </h1>
          <div className="space-x-4">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
            >
              <Download className="mr-2" size={20} />
              Export to CSV
            </button>
            <button
              onClick={() => navigate("/catalog/books")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to Books
            </button>
          </div>
        </div>

        {/* Filter and Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Filter by Month:
              </label>
              <input
                type="month"
                value={filterMonth}
                onChange={handleMonthChange}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Total Fines</p>
              <p className="text-xl font-bold text-gray-900">
                ${paymentSummary.totalFines.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                Total Collected
              </p>
              <p className="text-xl font-bold text-green-600">
                ${paymentSummary.totalCollected.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Total Pending</p>
              <p className="text-xl font-bold text-red-600">
                ${paymentSummary.totalPending.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Fines Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {filteredFines.length === 0 ? (
            <p className="text-gray-600 text-center">
              No fines found for this month.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      User ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      User Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Book Title
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Fine Amount
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Issue Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Due Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Payment Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Payment Amount
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFines.map((fine) => (
                    <tr key={fine.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {fine.userId}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {fine.userName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {fine.bookTitle}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        ${fine.fineAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {fine.issueDate}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {fine.dueDate}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            fine.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {fine.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {fine.paymentDate || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        ${fine.paymentAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {fine.status === "Unpaid" && (
                          <button
                            onClick={() => markAsPaid(fine.id)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center">
            <CheckCircle className="text-green-500 mr-3" size={20} />
            <p className="text-green-700">Action completed successfully!</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinesPage;
