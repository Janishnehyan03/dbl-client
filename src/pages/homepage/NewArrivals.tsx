import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../../components/BookCard";
import BookSkeleton from "../../components/BookSkeleton";
import Axios from "../../utils/Axios";

interface Book {
  id: string;
  title: string;
  publisher: {
    id: string;
    publisherName: string;
  };
  authors: {
    firstName: string;
    lastName: string;
  }[];
  // image: string;
}

const NewArrivals: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/books/new-arrivals/data");
        setBooks(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch new arrivals");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-3 bg-indigo-600 rounded-full"></div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/books"
            className="group inline-flex items-center text-base font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
          >
            Explore All Books
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <BookSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl text-gray-700 font-medium">
                Oops! Something went wrong: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Book Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3   gap-8">
            {books.length > 0 ? (
              books.map((book, i) => (
                <div
                  key={i}
                  className="transform transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-10"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <BookCard book={book} isNewArrival={true} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl text-gray-600 font-medium">
                  No new arrivals yet. Check back soon!
                </p>
                <Link
                  to="/books"
                  className="mt-4 inline-block px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors duration-300"
                >
                  Browse All Books
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
