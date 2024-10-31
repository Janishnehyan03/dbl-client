import { PlusCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import AddBook from "./AddBook";
import Axios from "../../../utils/Axios";
import { Link } from "react-router-dom";

const BooksPage: React.FC = () => {
  const [searchType, setSearchType] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [books, setBooks] = useState<any[]>([]);

  const getBooks = async () => {
    try {
      let { data } = await Axios.get("/books");
      setBooks(data);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  const getPlaceholder = () => {
    switch (searchType) {
      case "isbn":
        return "Enter ISBN";
      case "author":
        return "Enter Author";
      default:
        return "Enter Book Title";
    }
  };

  const filteredBooks = books.filter((book) => {
    if (searchType === "title") {
      return book.title.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === "isbn") {
      return book.ISBN.includes(searchTerm);
    } else if (searchType === "author") {
      return book.author.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  const getSelectThemeClass = () => {
    switch (searchType) {
      case "isbn":
        return "focus:ring-yellow-500";
      case "author":
        return "focus:ring-green-500";
      default:
        return "focus:ring-gray-500";
    }
  };

  return (
    <div className="mx-auto p-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-md border border-opacity-30 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-3xl font-bold text-gray-900">Books Page</h4>
        <button
          className={`bg-${
            showForm ? "gray-700" : "gray-600"
          } bg-opacity-70 hover:bg-opacity-90 text-white flex items-center space-x-2 px-5 py-2 rounded-lg shadow-lg transition duration-300`}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? <X /> : <PlusCircle />} {showForm ? "Close" : "New Book"}
        </button>
      </div>

      {showForm ? (
        <AddBook />
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <select
              className={`mr-4 p-3 rounded-lg bg-white bg-opacity-40 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${getSelectThemeClass()}`}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="title">Book Title</option>
              <option value="isbn">ISBN</option>
              <option value="author">Author</option>
            </select>
            <input
              type="text"
              className={`w-full p-3 rounded-lg bg-white bg-opacity-40 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${getSelectThemeClass()}`}
              placeholder={getPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-lg bg-white bg-opacity-20 backdrop-blur-lg shadow-md border border-opacity-20 border-gray-200">
            <table className="min-w-full bg-transparent">
              <thead>
                <tr className="bg-gray-900 bg-opacity-70 text-white text-left">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">ACC Number</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Pages</th>
                  <th className="py-3 px-4">Edition</th>
                  <th className="py-3 px-4">Published</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      index % 2 === 0
                        ? "bg-white bg-opacity-10"
                        : "bg-white bg-opacity-5"
                    } hover:bg-gray-500 hover:bg-opacity-20`}
                  >
                    <td className="py-2 px-4">
                      <Link
                        to={`/edit-book/${book._id}`}
                        className="text-gray-800 hover:underline"
                      >
                        {book.title}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{book?.accNumber}</td>
                    <td className="py-2 px-4 text-sm">
                      {book?.category?.categoryName}
                    </td>
                    <td className="py-2 px-4">{book.language?.languageName}</td>
                    <td className="py-2 px-4">{book.location?.locationName}</td>
                    <td className="py-2 px-4">{book.numberOfPages}</td>
                    <td className="py-2 px-4">{book.edition}</td>
                    <td className="py-2 px-4">
                      {book.published ? (
                        <span className="bg-green-500 bg-opacity-80 text-white px-2 py-1 rounded-lg">
                          Published
                        </span>
                      ) : (
                        <span className="bg-red-500 bg-opacity-80 text-white px-2 py-1 rounded-lg">
                          Unpublished
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
