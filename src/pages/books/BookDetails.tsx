// BookDetails.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Book } from "../../utils/types.ts";
import { getBook } from "../../utils/services/bookService.ts";
import BookStatusBadge from "../../components/books/BookStatusBadge.tsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AuthorList from "../../components/books/AuthorList";
import CategoryList from "../../components/books/CategoryList";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBook(id!);
        setBook(data);
      } catch (err) {
        setError("Failed to fetch book details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!book) return <div className="text-center mt-8">Book not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <div className="flex items-center mt-2">
            <BookStatusBadge status={book.status} />
            {book.isNewArrival && (
              <span className="ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
                New Arrival
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Column - Book Metadata */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Accession Number
                </h3>
                <p className="mt-1 text-lg font-semibold">{book.accNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Call Number
                </h3>
                <p className="mt-1 text-lg font-semibold">{book.callNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">ISBN</h3>
                <p className="mt-1 text-lg font-semibold">
                  {book.isbn || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">ISSN</h3>
                <p className="mt-1 text-lg font-semibold">
                  {book.issn || "N/A"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-semibold mb-3">Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Publisher
                  </h3>
                  <p className="mt-1">
                    {book.publisher?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Published Date
                  </h3>
                  <p className="mt-1">{book.publishedDate || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Edition</h3>
                  <p className="mt-1">{book.edition || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pages</h3>
                  <p className="mt-1">{book.pages || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Language
                  </h3>
                  <p className="mt-1">{book.language?.name || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="mt-1">{book.location?.name || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="mt-1">
                    {book.price ? `$${book.price.toFixed(2)}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-semibold mb-3">Authors</h2>
              <AuthorList authors={book.authors} />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-semibold mb-3">Categories</h2>
              <CategoryList categories={book.categories} />
            </div>

            {Array.isArray(book.keywords) && book.keywords.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-xl font-semibold mb-3">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {book.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Circulation Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">
                Circulation Information
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Current Holder
                  </h3>
                  <p className="mt-1">
                    {book.currentHolder
                      ? `${book.currentHolder.studentName} (${book.currentHolder._id})`
                      : "Available"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Issue Date
                  </h3>
                  <p className="mt-1">
                    {book.lastIssueDate
                      ? formatDate(book.lastIssueDate)
                      : "Never issued"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Issues
                  </h3>
                  <p className="mt-1">{book.totalIssues}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
