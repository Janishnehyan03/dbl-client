import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const SEARCH_BOOKS_QUERY = gql`
  query SearchBooks($field: String!, $value: String!) {
    searchBooks(field: $field, value: $value) {
      id
      title
      ISBN
      callNumber
      accNumber
      authors {
        firstName
        lastName
      }
    }
  }
`;

const SearchPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchField, setSearchField] = useState<
    "title" | "ISBN" | "callNumber" | "accNumber" | "author" | "englishTitle"
  >("title");

  const navigate = useNavigate();
  const [
    searchBooks,
    { data: bookData, loading: bookLoading, error: bookError },
  ] = useLazyQuery(SEARCH_BOOKS_QUERY);

  const handleFieldChange = (
    field:
      | "title"
      | "ISBN"
      | "callNumber"
      | "accNumber"
      | "author"
      | "englishTitle"
  ) => {
    setSearchField(field);
    setSearchInput("");
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchInput(input);

    if (input.trim().length > 0) {
      if (searchField === "author") {
        // For author field, search in all author objects
        searchBooks({ variables: { field: "author", value: input } });
      } else {
        searchBooks({ variables: { field: searchField, value: input } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-12 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-extrabold text-teal-700 mb-8">
        Library Book Search
      </h1>
      <p className="text-lg text-gray-600">
        Search for books by different criteria and explore our vast collection.
      </p>
    </div>

    {/* Search Bar */}
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row items-center">
        <input
          type="text"
          placeholder={`Search by ${searchField}...`}
          value={searchInput}
          onChange={handleSearchInputChange}
          className="w-full px-5 py-4 border border-gray-300 focus:ring-4 focus:ring-teal-400 rounded-t-lg md:rounded-l-lg md:rounded-t-none"
        />
        <button
          onClick={() =>
            searchBooks({
              variables: { field: searchField, value: searchInput },
            })
          }
          className="w-full md:w-auto px-8 py-4 bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all rounded-b-lg md:rounded-r-lg md:rounded-b-none"
        >
          Search
        </button>
      </div>
    </div>

    {/* Search Field Selection */}
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {[
        { field: "title", label: "Title" },
        { field: "ISBN", label: "ISBN" },
        { field: "callNumber", label: "Call Number" },
        { field: "accNumber", label: "Acc Number" },
        { field: "author", label: "Author" },
        { field: "englishTitle", label: "English Title" },
      ].map(({ field, label }) => (
        <button
          key={field}
          onClick={() =>
            handleFieldChange(
              field as
                | "title"
                | "ISBN"
                | "callNumber"
                | "accNumber"
                | "author"
                | "englishTitle"
            )
          }
          className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
            searchField === field
              ? "bg-teal-600 text-white shadow-md"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    {/* Book Search Results */}
    <div className="max-w-6xl mx-auto mt-12">
      {bookLoading && (
        <p className="text-center text-teal-600 font-semibold animate-pulse">
          Loading books...
        </p>
      )}
      {bookError && (
        <p className="text-center text-red-500 font-medium">
          Error: {bookError.message}
        </p>
      )}

      {bookData && bookData.searchBooks.length > 0 && (
        <div className="overflow-x-auto shadow-xl rounded-lg mt-8">
          <table className="w-full border-collapse bg-white rounded-lg">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-5 text-left">Title</th>
                <th className="p-5 text-left">Authors</th>
                <th className="p-5 text-left">ISBN</th>
                <th className="p-5 text-left">Call Number</th>
                <th className="p-5 text-left">Accession Number</th>
              </tr>
            </thead>
            <tbody>
              {bookData.searchBooks.map((book: any) => (
                <tr
                  key={book.id}
                  className="border-b hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <td className="p-5">{book.title}</td>
                  <td className="p-5">
                    {book.authors
                      .map(
                        (author: any) =>
                          `${author.firstName} ${author.lastName}`
                      )
                      .join(", ")}
                  </td>
                  <td className="p-5">{book.ISBN}</td>
                  <td className="p-5">{book.callNumber}</td>
                  <td className="p-5">{book.accNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {bookData && bookData.searchBooks.length === 0 && (
        <p className="text-center mt-6 text-gray-600 text-lg">
          No results found.
        </p>
      )}
    </div>
  </div>
  );
};

export default SearchPage;
