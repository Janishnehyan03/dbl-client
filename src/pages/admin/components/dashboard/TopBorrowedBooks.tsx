import { Loader, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../../../../utils/Axios";

const TopBorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTopBorrowedBooks = async () => {
    try {
      // Simulating an API call to fetch top borrowed books
      const response = await Axios.get("/dashboard/top-borrowed-books");
      return response.data;
    } catch (error) {
      // Handle error state if needed
      console.error("Error fetching top borrowed books:", error);
      throw error; // Re-throw to handle in useEffect
    }
  };

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const data = await getTopBorrowedBooks();
        setBooks(data);
      } catch (error) {
        // Handle error state if needed
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader className="animate-spin inline-block" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Top Borrowed Books
      </h2>
      {books.length === 0 ? (
        <p className="text-gray-600">No borrowing data available.</p>
      ) : (
        <ul className="space-y-4">
          {books.map((book:any) => (
            <li key={book.bookId} className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">{book.title}</p>
                <p className="text-sm text-gray-500">
                  {book.borrowCount} borrows
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopBorrowedBooks;
