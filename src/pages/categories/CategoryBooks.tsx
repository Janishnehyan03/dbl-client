import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../../utils/Axios";
import BookCard from "../../components/BookCard";

// Modern UI improvements require Tailwind CSS or similar utility classes.
// This version adds a glassmorphism header, improved grid, animated loading, and modern empty state.

function CategoryBooks() {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await Axios.get(`/categories/${id}/books`);
        setBooks(res.data.books);
        setCategory(res.data.category);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-lg text-gray-700 font-medium">
          Loading books...
        </span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-8">
      {/* Glassmorphism header */}
      <div className="max-w-7xl mx-auto mb-8 px-6 py-6 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          {category ? "Books in " : "Books"}
          {category && <span className="text-blue-600">{category.name}</span>}
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Explore the collection of books available
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 rounded-xl bg-white/60 shadow-inner border border-dashed border-gray-300">
            <svg
              className="w-16 h-16 text-blue-300 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="text-lg text-gray-500 font-medium">
              No books found in this category.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {books.map((book: any) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryBooks;
