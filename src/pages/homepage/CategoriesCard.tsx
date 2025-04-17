import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import { Link } from "react-router-dom";
import BookSkeleton from "../../components/BookSkeleton";
import { ICategory } from "../../utils/types";
import Title from "../../components/ui/Title";
import BookCard from "../../components/BookCard";

interface Book {
  id: string;
  title: string;
  authors: [{ firstName: string }];
  image?: string;
  category?: string;
}

const CategoriesCard: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get("/categories");
        const fetchedCategories: ICategory[] = response.data;
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch books for selected category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await Axios.get(`/books/${selectedCategory._id}/data`);
        setBooks(response.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategory]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <Title title="Browse by Category" />
          <Link
            to="/books"
            className="group inline-flex items-center text-base font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
          >
            Explore All
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

        {/* Categories List */}
        <div className="flex space-x-3 mb-12 overflow-x-auto scrollbar-hide pb-2 snap-x">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 text-sm font-semibold rounded-full whitespace-nowrap transition-all duration-300 snap-start ${
                selectedCategory?._id === category._id
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-sm"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <BookSkeleton key={i} />
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
              <p className="text-xl text-gray-700 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Filtered Book Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {books.length > 0 ? (
              books
                .slice(0, 15)
                .map((book: Book, i) => <BookCard book={book} key={i} />)
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xl text-gray-600 font-medium">
                  No books found in this category.
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

export default CategoriesCard;
