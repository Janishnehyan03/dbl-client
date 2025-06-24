import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Axios from "../utils/Axios";

const SearchPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchField, setSearchField] = useState<
    "title" | "isbn" | "callNumber" | "accNumber" | "author" 
  >("title");
  const [bookData, setBookData] = useState<any[]>([]);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchBooks = async (field: string, value: string) => {
    setBookLoading(true);
    setBookError(null);
    try {
      // Construct query params as before
      const params = new URLSearchParams();
      params.append("search", `${field}:${value}`);
      // Use axios instead of fetch
      const response = await Axios.get(
        `/books/search/data?${params.toString()}`
      );
      setBookData(response.data || []);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setBookError(
          error.response?.data?.message || error.message || "Unknown error"
        );
      } else {
        setBookError(error.message || "Unknown error");
      }
      setBookData([]);
    } finally {
      setBookLoading(false);
    }
  };

  const handleFieldChange = (
    field:
      | "title"
      | "isbn"
      | "callNumber"
      | "accNumber"
      | "author"
  ) => {
    setSearchField(field);
    setSearchInput("");
    setBookData([]);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchInput(input);
    if (input.trim().length > 0) {
      fetchBooks(searchField, input);
    } else {
      setBookData([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Library Catalog Search
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Discover books from our extensive collection with ease
        </p>
      </div>

      {/* Search Container */}
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-white rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder={`Search by ${searchField}...`}
              value={searchInput}
              onChange={handleSearchInputChange}
              className="flex-1 px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={() => fetchBooks(searchField, searchInput)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {/* Field Selection */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {[
            { field: "title", label: "Title" },
            { field: "isbn", label: "ISBN" },
            { field: "callNumber", label: "Call Number" },
            { field: "accNumber", label: "Acc Number" },
            { field: "author", label: "Author" },
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleFieldChange(field as any)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                searchField === field
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto mt-10">
        {bookLoading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading results...</p>
          </div>
        )}
        {bookError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">Error: {bookError}</p>
          </div>
        )}

        {bookData && bookData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-indigo-50">
                  <tr>
                    {[
                      "Title",
                      "Authors",
                      "ISBN",
                      "Call Number",
                      "Acc Number",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookData.map((book: any) => (
                    <tr
                      key={book.id}
                      className="hover:bg-gray-50 transition-all duration-150 cursor-pointer"
                      onClick={() => navigate(`/book/${book.id}`)}
                    >
                      <td className="px-6 py-4 text-gray-900">{book.title}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {book.authors
                          .map((author: any) => author.name)
                          .join(", ")}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{book.isbn}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {book.callNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {book.accNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {bookData && bookData.length === 0 && !bookLoading && (
          <div className="text-center py-10 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600 text-lg">No matching books found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
