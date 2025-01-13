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
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-600">
        Library Book Search
      </h1>

      <div className="flex flex-col items-center w-full max-w-3xl mx-auto mb-12">
        <div className="flex w-full rounded-lg shadow-lg">
          <input
            type="text"
            placeholder={`Search by ${searchField}...`}
            value={searchInput}
            onChange={handleSearchInputChange}
            className="w-full px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() =>
              searchBooks({
                variables: { field: searchField, value: searchInput },
              })
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
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
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                searchField === field
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {bookLoading && (
          <p className="text-center text-blue-600">Loading books...</p>
        )}
        {bookError && (
          <p className="text-center text-red-500">Error: {bookError.message}</p>
        )}

        {bookData && bookData.searchBooks.length > 0 && (
          <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-4 border border-gray-300">Title</th>
                <th className="p-4 border border-gray-300">Authors</th>
                <th className="p-4 border border-gray-300">ISBN</th>
                <th className="p-4 border border-gray-300">Call Number</th>
                <th className="p-4 border border-gray-300">Accession Number</th>
              </tr>
            </thead>
            <tbody>
              {bookData.searchBooks.map((book: any) => (
                <tr
                  key={book.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <td className="p-4 border border-gray-300">{book.title}</td>
                  <td className="p-4 border border-gray-300">
                    {book.authors
                      .map(
                        (author: any) =>
                          `${author.firstName} ${author.lastName}`
                      )
                      .join(", ")}
                  </td>
                  <td className="p-4 border border-gray-300">{book.ISBN}</td>
                  <td className="p-4 border border-gray-300">
                    {book.callNumber}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {book.accNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {bookData && bookData.searchBooks.length === 0 && (
          <p className="text-center mt-6 text-gray-600">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
