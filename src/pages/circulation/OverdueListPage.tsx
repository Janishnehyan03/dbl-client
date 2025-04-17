import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OverdueListPage: React.FC = () => {
  const navigate = useNavigate();
  const [overdueBooks, setOverdueBooks] = useState<
    {
      id: string;
      title: string;
      patronName: string;
      patronId: string;
      issueDate: string;
      dueDate: string;
      fine: number;
      returned?: boolean;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data fetch (replace with actual backend API call)
  useEffect(() => {
    const fetchOverdueBooks = () => {
      setLoading(true);
      setError(null);

      // Simulate API delay and data
      setTimeout(() => {
        try {
          const mockOverdueBooks = [
            {
              id: "ACC001",
              title: "The Great Gatsby",
              patronName: "John Doe",
              patronId: "ADM001",
              issueDate: "2025-03-01",
              dueDate: "2025-03-15",
              fine: 2.0, // $0.25/day for 8 days overdue as of March 23, 2025
            },
            {
              id: "ACC003",
              title: "To Kill a Mockingbird",
              patronName: "Jane Smith",
              patronId: "ADM002",
              issueDate: "2025-02-25",
              dueDate: "2025-03-11",
              fine: 3.0, // $0.25/day for 12 days overdue
            },
          ];
          setOverdueBooks(mockOverdueBooks);
          setLoading(false);
        } catch {
          setError("Failed to load overdue books.");
          setLoading(false);
        }
      }, 1000);
    };

    fetchOverdueBooks();
  }, []);

  // Handle marking a book as returned
  const handleReturn = (bookId: string) => {
    setLoading(true);
    setError(null);

    setTimeout(() => { // Simulate backend processing
      try {
        // Backend would update the book's status
        console.log("Book Returned:", {
          bookId,
          returnDate: new Date().toISOString(), // Backend sets this
        });

        setOverdueBooks((prev) =>
          prev.map((book) =>
            book.id === bookId ? { ...book, returned: true } : book
          )
        );
        setLoading(false);
      } catch {
        setError("Failed to process return.");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clock className="mr-3 text-indigo-600" size={32} />
            Overdue Books
          </h1>
          <button
            onClick={() => navigate("/book-issue-return")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Circulation
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading overdue books...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
              <AlertTriangle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          ) : overdueBooks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No overdue books found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Book
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Patron
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Issue Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Fine
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {overdueBooks.map((book) => (
                    <tr
                      key={book.id}
                      className={`transition-all duration-150 ${
                        book.returned ? "bg-green-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-900">
                        {book.title} ({book.id})
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {book.patronName} ({book.patronId})
                      </td>
                      <td className="px-6 py-4 text-gray-700">{book.issueDate}</td>
                      <td className="px-6 py-4 text-gray-700">{book.dueDate}</td>
                      <td className="px-6 py-4 text-gray-700">
                        ${book.fine.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {book.returned ? (
                          <span className="flex items-center text-green-600">
                            <CheckCircle className="mr-2" size={16} />
                            Returned
                          </span>
                        ) : (
                          <button
                            onClick={() => handleReturn(book.id)}
                            disabled={loading}
                            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${
                              loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {loading ? "Processing..." : "Mark Returned"}
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
      </div>
    </div>
  );
};

export default OverdueListPage;