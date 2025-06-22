import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Book,
  Edit,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { fetchBooks } from "../../utils/services/bookService";
import { BookDocument, IPublisher, ICategory, Author } from "../../utils/types";
import { fetchCategories } from "../../utils/services/categoryService";
import { fetchAuthors } from "../../utils/services/authorService";
import { fetchPublishers } from "../../utils/services/publisherService";

const CatalogBooksPage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookDocument[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookDocument[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<IPublisher[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available" | "unavailable" | "lost" | "damaged" | "issued"
  >("all");
  const [publishedYearFilter, setPublishedYearFilter] = useState<
    [number, number]
  >([0, new Date().getFullYear()]);

  // Sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BookDocument;
    direction: "ascending" | "descending";
  } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [booksData, categoriesData, authorsData, publishersData] =
          await Promise.all([
            fetchBooks(),
            fetchCategories(),
            fetchAuthors(),
            fetchPublishers(),
          ]);

        setBooks(booksData);
        setFilteredBooks(booksData);
        setCategories(categoriesData);
        setAuthors(authorsData);
        setPublishers(publishersData);

        // Set max published year for filter range
        const maxYear = Math.max(
          ...booksData
            .filter((book: BookDocument) => book.publishedDate) // Filter out undefined dates
            .map((book: BookDocument) =>
              new Date(book.publishedDate!).getFullYear()
            )
        );
        setPublishedYearFilter([1900, maxYear]);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...books];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.accNumber.toLowerCase().includes(query) ||
          book.authors.some((author) =>
            authors
              .find((a) => a._id === author._id)
              ?.name.toLowerCase()
              .includes(query)
          ) ||
          book.categories.some((category) =>
            categories
              .find((c) => c._id === category._id)
              ?.name.toLowerCase()
              .includes(query)
          )
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((book) =>
        book.categories.some((cat) => cat._id === selectedCategory)
      );
    }

    // Apply author filter
    if (selectedAuthor) {
      result = result.filter((book) =>
        book.authors.some((auth) => auth._id === selectedAuthor)
      );
    }

    // Apply publisher filter
    if (selectedPublisher) {
      result = result.filter(
        (book) => book.publisher && book.publisher._id === selectedPublisher
      );
    }

    // Apply availability filter
    if (availabilityFilter !== "all") {
      result = result.filter((book) => book.status === availabilityFilter);
    }

    // Apply published year filter
    result = result.filter((book) => {
      const year = book.publishedDate
        ? new Date(book.publishedDate).getFullYear()
        : 0;
      return year >= publishedYearFilter[0] && year <= publishedYearFilter[1];
    });

    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        let aValue: any, bValue: any;

        // Handle nested objects for sorting
        if (sortConfig.key === "authors") {
          aValue =
            authors.find((author) => author._id === a.authors[0]?._id)?.name ||
            "";
          bValue =
            authors.find((author) => author._id === b.authors[0]?._id)?.name ||
            "";
        } else if (sortConfig.key === "categories") {
          aValue =
            categories.find((category) => category._id === a.categories[0]?._id)
              ?.name || "";
          bValue =
            categories.find((category) => category._id === b.categories[0]?._id)
              ?.name || "";
        } else if (sortConfig.key === "publisher") {
          aValue =
            publishers.find((p) => p._id === a.publisher?._id)?.name || "";
          bValue =
            publishers.find((p) => p._id === b.publisher?._id)?.name || "";
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredBooks(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    books,
    searchQuery,
    selectedCategory,
    selectedAuthor,
    selectedPublisher,
    availabilityFilter,
    publishedYearFilter,
    sortConfig,
    authors,
    categories,
    publishers,
  ]);

  // Request sort
  const requestSort = (key: keyof BookDocument) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (bookId: string) => {
    navigate(`/catalog/books/${bookId}`);
  };

  // Get publisher name
  const getPublisherName = (publisherId: { _id: string }) => {
    return publishers.find((p) => p._id === publisherId._id)?.name || "Unknown";
  };

  // Render sort indicator
  const renderSortIndicator = (key: keyof BookDocument) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 inline" size={16} />
    ) : (
      <ChevronDown className="ml-1 inline" size={16} />
    );
  };

  // Render table
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-indigo-50">
          <tr>
            <th
              className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort("accNumber")}
            >
              Acc. Number {renderSortIndicator("accNumber")}
            </th>
            <th
              className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort("callNumber")}
            >
              Call Number {renderSortIndicator("callNumber")}
            </th>
            <th
              className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort("title")}
            >
              Title {renderSortIndicator("title")}
            </th>
            <th
              className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort("publisher")}
            >
              Publisher {renderSortIndicator("publisher")}
            </th>

            <th
              className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort("published")}
            >
              Published {renderSortIndicator("published")}
            </th>
            <th
              className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer"
              onClick={() => requestSort("isNewArrival")}
            >
              New Arrival {renderSortIndicator("isNewArrival")}
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentItems.map((book) => (
            <tr
              key={book._id}
              className="hover:bg-gray-50 transition-all duration-150"
            >
              <td className="px-6 py-4 text-gray-900">{book.accNumber}</td>
              <td className="px-6 py-4 text-gray-700">
                <div className="font-medium">{book.callNumber}</div>
                {book.isbn && (
                  <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>
                )}
              </td>
              <td className="px-6 py-4 text-gray-700">
                <div className="font-medium">{book.title}</div>
                {book.status === "available" ? (
                  <span className="text-green-600 font-medium text-sm italic">
                    {book.status}
                  </span>
                ) : book.status === "issued" ? (
                  <span className="text-blue-600 font-medium text-sm italic">
                    {book.status}
                  </span>
                ) : book.status === "lost" ? (
                  <span className="text-orange-600 font-medium text-sm italic">
                    {book.status}
                  </span>
                ) : book.status === "damaged" ? (
                  <span className="text-red-600 font-medium text-sm italic">
                    {book.status}
                  </span>
                ) : (
                  <span className="text-gray-600 font-medium text-sm italic">
                    {book.status}
                  </span>
                )}
              </td>

              <td className="px-6 py-4 text-gray-700">
                {book.publisher ? getPublisherName(book.publisher) : "Unknown"}
              </td>
              <td className="px-6 py-4 text-center">
                {book.published ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  ""
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {book.isNewArrival ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  ""
                )}
              </td>

              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(book._id)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <Edit className="mr-2" size={16} />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(indexOfLastItem, filteredBooks.length)}
          </span>{" "}
          of <span className="font-medium">{filteredBooks.length}</span> results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 border rounded-md text-sm font-medium ${
                currentPage === number
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Book className="mr-3 text-indigo-600" size={32} />
            Books Catalog
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/catalog/books/new")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              Add New Book
            </button>
            <button
              onClick={() => navigate("/catalog")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to Catalog
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books by title, author, ISBN, or accession number..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              {/* Basic Filters */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Authors</option>
                  {authors.map((author) => (
                    <option key={author._id} value={author._id}>
                      {author.name}
                    </option>
                  ))}
                </select>

                <select
                  value={availabilityFilter}
                  onChange={(e) =>
                    setAvailabilityFilter(
                      e.target.value as "all" | "available" | "unavailable"
                    )
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available</option>
                  <option value="issued">issued</option>
                  <option value="lost">Lost</option>
                  <option value="damaged">Damaged</option>
                </select>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <Filter className="mr-2" size={16} />
                  {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Advanced Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publisher
                    </label>
                    <select
                      value={selectedPublisher}
                      onChange={(e) => setSelectedPublisher(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">All Publishers</option>
                      {publishers.map((publisher) => (
                        <option key={publisher._id} value={publisher._id}>
                          {publisher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Published Year Range: {publishedYearFilter[0]} -{" "}
                      {publishedYearFilter[1]}
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={publishedYearFilter[0]}
                        onChange={(e) =>
                          setPublishedYearFilter([
                            parseInt(e.target.value),
                            publishedYearFilter[1],
                          ])
                        }
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={publishedYearFilter[1]}
                        onChange={(e) =>
                          setPublishedYearFilter([
                            publishedYearFilter[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-10">
              <Loader2 className="inline-block animate-spin h-8 w-8 text-indigo-600" />
              <p className="mt-2 text-gray-600">Loading books...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
              <AlertTriangle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Retry
              </button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">
                No books found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSelectedAuthor("");
                  setSelectedPublisher("");
                  setAvailabilityFilter("all");
                  setPublishedYearFilter([1900, new Date().getFullYear()]);
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {renderTable()}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogBooksPage;
