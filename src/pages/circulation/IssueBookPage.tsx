import { AlertCircle, Book, CheckCircle, Search, User, X } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import debounce from "lodash/debounce";

// TypeScript Interfaces
interface Patron {
  _id: string;
  name: string;
  admissionNumber?: string;
  section: { name: string } | string;
  division?: { name: string } | string | null;
  department?: { name: string } | string | null;
  class?: { name: string } | string | null;
  role: { name: string } | string;
  borrowedBooks: Array<{ title: string; _id: string } | string>;
  dueFines: number;
}

interface Book {
  _id: string;
  title: string;
  accNumber: string;
  callNumber?: string;
  authors?: Array<{ name: string } | string>;
  isbn?: string;
  available: boolean;
}

// Validation Function
const validateInput = (value: string): boolean => /^[A-Za-z0-9-]+$/.test(value);

const IssueBookPage: React.FC = () => {
  const navigate = useNavigate();
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [bookAccNumber, setBookAccNumber] = useState("");
  const [patron, setPatron] = useState<Patron | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"patron" | "book" | "confirm">("patron");

  // Debounced Search Handlers
  const handlePatronSearch = useCallback(
    debounce(async (admNumber: string) => {
      if (!validateInput(admNumber)) {
        setError("Admission Number must be alphanumeric.");
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const response = await Axios.get(
          `/patrons/search/data?search=${admNumber}`
        );
        const foundPatrons = response.data; // Expect single object
        if (foundPatrons && foundPatrons.length > 0) {
          const foundPatron = foundPatrons[0]; // Use the first found patron
          if (foundPatron) {
            setAdmissionNumber(foundPatron.admissionNumber || "");
            setPatron(foundPatron);
            setStep("book");
          } else {
            setError("No patron found with this Admission Number.");
          }
        } else {
          setError("No patron found with this Admission Number.");
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch patron."
        );
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleBookSearch = useCallback(
    debounce(async (accNumber: string) => {
      if (!validateInput(accNumber)) {
        setError("Accession Number must be alphanumeric.");
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const response = await Axios.get(
          `/books/search/data?search=${accNumber}`
        );
        const foundBooks = response.data; // Expect single object
        if (foundBooks && foundBooks.length > 0) {
          const foundBook = foundBooks[0]; // Use the first found book
          if (foundBook && foundBook.accNumber === accNumber) {
            if (foundBook.available) {
              setBook(foundBook);
              setStep("confirm");
            } else {
              setError("This book is currently not available.");
            }
          } else {
            setError("Book not found with this Accession Number.");
          }
        } else {
          setError("Book not found with this Accession Number.");
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch book."
        );
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Issue Book Handler
  const handleIssue = useCallback(async () => {
    if (!patron || !book) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await Axios.post("/issues", {
        patronId: patron._id,
        bookId: book._id,
      });
      setSuccess(true);
      setTimeout(() => resetForm(), 2000);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to issue book."
      );
    } finally {
      setLoading(false);
    }
  }, [patron, book]);

  // Reset Form
  const resetForm = useCallback(() => {
    setAdmissionNumber("");
    setBookAccNumber("");
    setPatron(null);
    setBook(null);
    setStep("patron");
    setError(null);
    setSuccess(false);
  }, []);

  // Memoized Patron Details
  const patronDetails = useMemo(() => {
    if (!patron) return null;
    const isStudent =
      typeof patron.role === "string"
        ? patron.role.toLowerCase() === "student"
        : patron.role?.name?.toLowerCase() === "student";
    return (
      <div className="p-6 bg-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4">
          Patron Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-indigo-600 font-medium">Name:</span>{" "}
            <span className="text-indigo-900">{patron.name}</span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Section:</span>{" "}
            <span className="text-indigo-900">
              {typeof patron.section === "string"
                ? patron.section
                : patron.section?.name || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Role:</span>{" "}
            <span className="text-indigo-900">
              {typeof patron.role === "string"
                ? patron.role
                : patron.role?.name || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Due Fines:</span>{" "}
            <span className="text-indigo-900">
              ${patron.dueFines?.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-indigo-600 font-medium">Borrowed Books:</span>{" "}
            <span className="text-indigo-900">
              {patron.borrowedBooks?.length > 0
                ? patron.borrowedBooks
                    .map((b) => (typeof b === "string" ? b : b.title || b._id))
                    .join(", ")
                : "None"}
            </span>
          </div>
          {isStudent ? (
            <>
              <div>
                <span className="text-indigo-600 font-medium">
                  Admission Number:
                </span>{" "}
                <span className="text-indigo-900">
                  {patron.admissionNumber || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-indigo-600 font-medium">Class:</span>{" "}
                <span className="text-indigo-900">
                  {typeof patron.class === "string"
                    ? patron.class
                    : patron.class?.name || "N/A"}
                </span>
              </div>
            </>
          ) : (
            <div>
              <span className="text-indigo-600 font-medium">Department:</span>{" "}
              <span className="text-indigo-900">
                {typeof patron.department === "string"
                  ? patron.department
                  : patron.department?.name || "N/A"}
              </span>
            </div>
          )}
          {patron.division && (
            <div>
              <span className="text-indigo-600 font-medium">Division:</span>{" "}
              <span className="text-indigo-900">
                {typeof patron.division === "string"
                  ? patron.division
                  : patron.division?.name || "N/A"}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }, [patron]);

  // Memoized Book Details
  const bookDetails = useMemo(() => {
    if (!book) return null;
    return (
      <div className="p-6 bg-indigo-50 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4">
          Book Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-indigo-600 font-medium">Title:</span>{" "}
            <span className="text-indigo-900" title={book.title}>
              {book.title.length > 30
                ? `${book.title.slice(0, 27)}...`
                : book.title}
            </span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">
              Accession Number:
            </span>{" "}
            <span className="text-indigo-900">{book.accNumber}</span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Call Number:</span>{" "}
            <span className="text-indigo-900">{book.callNumber || "N/A"}</span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">ISBN:</span>{" "}
            <span className="text-indigo-900">{book.isbn || "N/A"}</span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Authors:</span>{" "}
            <span className="text-indigo-900">
              {book.authors?.length
                ? book.authors
                    .map((a) => (typeof a === "string" ? a : a.name))
                    .join(", ")
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-indigo-600 font-medium">Status:</span>{" "}
            <span className="text-indigo-900">
              {book.available ? "Available" : "Not Available"}
            </span>
          </div>
        </div>
      </div>
    );
  }, [book]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Book className="mr-3 text-indigo-600" size={32} />
            Issue Book
          </h1>
          <button
            onClick={() => navigate("/book-issue-return")}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            aria-label="Back to Circulation"
          >
            Back to Circulation
          </button>
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {["Patron", "Book", "Confirm"].map((s, idx) => (
              <div key={s} className="flex-1 text-center">
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    step === "patron" && idx === 0
                      ? "bg-indigo-600 text-white"
                      : step === "book" && idx === 1
                      ? "bg-indigo-600 text-white"
                      : step === "confirm" && idx === 2
                      ? "bg-indigo-600 text-white"
                      : idx < ["patron", "book", "confirm"].indexOf(step)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {idx + 1}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Step 1: Patron Search */}
          {step === "patron" && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="admissionNumber"
                  className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <User className="mr-2 text-gray-500" size={18} />
                  Admission Number
                </label>
                <div className="flex space-x-4">
                  <input
                    id="admissionNumber"
                    type="text"
                    value={admissionNumber}
                    onChange={(e) => {
                      setAdmissionNumber(e.target.value);
                      if (e.target.value) handlePatronSearch(e.target.value);
                    }}
                    placeholder="Enter Admission Number (e.g., ADM001)"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    aria-required="true"
                    disabled={loading}
                  />
                  <button
                    onClick={() => handlePatronSearch(admissionNumber)}
                    disabled={loading || !admissionNumber}
                    className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center ${
                      loading || !admissionNumber
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    aria-label="Search Patron"
                  >
                    <Search className="mr-2" size={18} />
                    {loading ? "Searching..." : "Search Patron"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Book Search */}
          {step === "book" && (
            <div className="space-y-6">
              {patronDetails}
              <div>
                <label
                  htmlFor="bookAccNumber"
                  className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <Book className="mr-2 text-gray-500" size={18} />
                  Book Accession Number
                </label>
                <div className="flex space-x-4">
                  <input
                    id="bookAccNumber"
                    type="text"
                    value={bookAccNumber}
                    onChange={(e) => {
                      setBookAccNumber(e.target.value);
                      if (e.target.value) handleBookSearch(e.target.value);
                    }}
                    placeholder="Enter Accession Number (e.g., ACC001)"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    aria-required="true"
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleBookSearch(bookAccNumber)}
                    disabled={loading || !bookAccNumber}
                    className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center ${
                      loading || !bookAccNumber
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    aria-label="Search Book"
                  >
                    <Search className="mr-2" size={18} />
                    {loading ? "Searching..." : "Search Book"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === "confirm" && (
            <div className="space-y-6">
              {patronDetails}
              {bookDetails}
              <div className="p-6 bg-indigo-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                  Issue Summary
                </h3>
                <p className="text-indigo-800">
                  Issuing <strong>{book?.title}</strong> to{" "}
                  <strong>{patron?.name}</strong>.
                </p>
                <p className="text-indigo-600 text-sm mt-2">
                  Issue Date: {new Date().toLocaleDateString()} | Due Date:{" "}
                  {new Date(
                    Date.now() + 14 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-all duration-200 flex items-center"
                  aria-label="Reset Form"
                >
                  <X className="mr-2" size={18} />
                  Reset
                </button>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep("book")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                    aria-label="Back to Book Search"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleIssue}
                    disabled={loading}
                    className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Issue Book"
                  >
                    {loading ? "Issuing..." : "Issue Book"}
                  </button>
                </div>
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
              <p className="text-green-700">Book issued successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(IssueBookPage);
