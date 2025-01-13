import { PlusCircle, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_ALL_BOOKS } from "../../../graphql/queries/bookQuery";
import AddBook from "./AddBook";
import TableSkeleton from "../../../components/TableSkeleton";

const BooksPage: React.FC = () => {
  const [searchType, setSearchType] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [bookLimit, setBookLimit] = useState(40);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: booksData,
    loading: bookLoading,
    error: bookError,
  } = useQuery(GET_ALL_BOOKS, {
    variables: {
      limit: bookLimit,
      skip: (currentPage - 1) * bookLimit, // Calculate offset based on the current page
    },
  });

  if (bookLoading) return <TableSkeleton />;
  if (bookError) return <p>Something went wrong</p>;

  const getPlaceholder = () => {
    return searchType === "accNumber"
      ? "Enter Acc Number"
      : searchType === "callNumber"
        ? "Enter Call Number"
        : "Enter Book Title";
  };

  const getSelectThemeClass = () => {
    return searchType === "isbn"
      ? "focus:ring-yellow-500"
      : searchType === "author"
        ? "focus:ring-green-500"
        : "focus:ring-gray-500";
  };

  const totalBooks = booksData?.totalCount || 0; // Assuming totalCount is returned from the query
  const totalPages = Math.ceil(totalBooks / bookLimit);

  const filteredBooks = booksData.books.filter((book: any) => {
    if (searchType === "title")
      return book.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (searchType === "accNumber") return book?.accNumber?.includes(searchTerm);
    if (searchType === "callNumber")
      return book?.callNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return false;
  });

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
              <option value="accNumber">Acc Number</option>
              <option value="callNumber">Call Number</option>
            </select>
            <input
              type="text"
              className={`w-full p-3 rounded-lg bg-white bg-opacity-40 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${getSelectThemeClass()}`}
              placeholder={getPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Dropdown for selecting number of books to display */}
            <div>
              <select
                className="p-3 rounded-lg bg-white bg-opacity-40 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={bookLimit}
                onChange={(e) => setBookLimit(Number(e.target.value))}
              >
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg bg-white bg-opacity-20 backdrop-blur-lg shadow-md border border-opacity-20 border-gray-200">
            <table className="min-w-full bg-transparent">
              <thead>
                <tr className="bg-gray-900 bg-opacity-70 text-white text-left">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">ACC Number</th>
                  <th className="py-3 px-4">Call Number</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Pages</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Edition</th>
                  <th className="py-3 px-4">Published</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book: any, index: number) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      index % 2 === 0
                        ? "bg-white bg-opacity-10"
                        : "bg-white bg-opacity-5"
                    } hover:bg-gray-500 hover:bg-opacity-20`}
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/edit-book/${book.id}`}
                        className="text-gray-800 hover:underline"
                      >
                        {book.title}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{book.accNumber}</td>
                    <td className="py-2 px-4">{book.callNumber}</td>
                    <td className="py-2 px-4 text-sm">
                      {book.category?.categoryName}
                    </td>
                    <td className="py-2 px-4">{book.language?.languageName}</td>
                    <td className="py-2 px-4">{book.numberOfPages}</td>
                    <td className="py-2 px-4">{book.location?.locationName}</td>
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

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-600 text-white p-2 rounded-lg disabled:bg-gray-300"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-gray-600 text-white p-2 rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
