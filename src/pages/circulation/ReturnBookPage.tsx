import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, CheckCircle, AlertCircle, Search } from "lucide-react";

const ReturnBookPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookAccNumber, setBookAccNumber] = useState("");
  const [issuedBook, setIssuedBook] = useState<{
    id: string;
    title: string;
    patronName: string;
    patronId: string;
    issueDate: string;
    dueDate: string;
    fine?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"search" | "confirm">("search");

  // Mock data for issued books (replace with actual backend data)
  const mockIssuedBooks = [
    {
      id: "ACC001",
      title: "The Great Gatsby",
      patronName: "John Doe",
      patronId: "ADM001",
      issueDate: "2025-03-10",
      dueDate: "2025-03-24",
      fine: 0, // No fine if returned on time
    },
    {
      id: "ACC003",
      title: "To Kill a Mockingbird",
      patronName: "Jane Smith",
      patronId: "ADM002",
      issueDate: "2025-03-01",
      dueDate: "2025-03-15",
      fine: 2.5, // Fine for overdue (assuming $0.25/day past due)
    },
  ];

  // Search Issued Book by Accession Number
  const handleBookSearch = () => {
    setError(null);
    setLoading(true);
    const foundBook = mockIssuedBooks.find((b) => b.id === bookAccNumber);
    setTimeout(() => {
      // Simulate backend delay
      if (foundBook) {
        setIssuedBook(foundBook);
        setStep("confirm");
      } else {
        setError("No issued book found with this Accession Number.");
      }
      setLoading(false);
    }, 500);
  };

  // Process Book Return
  const handleReturn = () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    setTimeout(() => {
      // Simulate backend processing
      // Backend would handle return date and fine calculation
      console.log("Book Returned:", {
        bookId: issuedBook?.id,
        patronId: issuedBook?.patronId,
        returnDate: new Date().toISOString(), // Backend sets this
        fine: issuedBook?.fine,
      });

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setSuccess(false);
        setBookAccNumber("");
        setIssuedBook(null);
        setStep("search");
      }, 2000); // Reset after 2 seconds
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Book className="mr-3 text-indigo-600" size={32} />
            Return Book
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
          {/* Step 1: Book Search */}
          {step === "search" && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Book className="mr-2 text-gray-500" size={18} />
                  Book Accession Number
                </label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={bookAccNumber}
                    onChange={(e) => setBookAccNumber(e.target.value)}
                    placeholder="Enter Accession Number (e.g., ACC001)"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleBookSearch}
                    disabled={loading || !bookAccNumber}
                    className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center ${
                      loading || !bookAccNumber
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Search className="mr-2" size={18} />
                    {loading ? "Searching..." : "Search Book"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === "confirm" && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 rounded-lg space-y-2">
                <p className="text-indigo-800 font-medium">
                  Book: {issuedBook?.title} ({issuedBook?.id})
                </p>
                <p className="text-indigo-800 font-medium">
                  Patron: {issuedBook?.patronName} ({issuedBook?.patronId})
                </p>
                <p className="text-indigo-600 text-sm">
                  Issued: {issuedBook?.issueDate} | Due: {issuedBook?.dueDate}
                </p>
                {(issuedBook?.fine ?? 0) > 0 && (
                  <p className="text-red-600 text-sm font-medium">
                    Fine Due: ${(issuedBook?.fine ?? 0).toFixed(2)}
                  </p>
                )}
                <p className="text-indigo-600 text-sm">
                  Return Date: Set by backend
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setStep("search")}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleReturn}
                  disabled={loading}
                  className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Return Book"}
                </button>
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <p className="text-green-700">Book returned successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnBookPage;
