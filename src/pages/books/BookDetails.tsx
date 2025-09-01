// BookDetails.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBook } from "../../utils/services/bookService.ts";
import { Book } from "../../utils/types.ts"; // Assumed to have an optional 'description' field

// Components
import AuthorList from "../../components/books/AuthorList";
import BookStatusBadge from "../../components/books/BookStatusBadge.tsx";
import CategoryList from "../../components/books/CategoryList";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

// Icons
import {
  BookMarked,
  BookOpen,
  Building,
  Calendar,
  CalendarClock,
  FileText,
  Hash,
  Info,
  Languages,
  Library,
  XCircle,
} from "lucide-react";
import moment from "moment";

// Helper Function
const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Reusable component for displaying metadata items
const MetadataItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | undefined | null;
}) => (
  <div className="flex items-start gap-3">
    <Icon
      className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0"
      strokeWidth={1.5}
    />
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium text-slate-800">{value || "N/A"}</p>
    </div>
  </div>
);

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No book ID provided.");
      setLoading(false);
      return;
    }

    const fetchBook = async () => {
      try {
        const data = await getBook(id);
        // Add a mock description if not present, for demonstration
        if (!data.description) {
          data.description =
            "This comprehensive book provides an in-depth look into its subject matter, offering valuable insights and detailed analysis. It is an essential resource for students and researchers alike.";
        }
        setBook(data);
      } catch (err) {
        setError("Failed to fetch book details. The book may not exist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-12 px-4">
        <XCircle className="mx-auto h-12 w-12 text-red-400" />
        <h2 className="mt-4 text-xl font-semibold text-slate-800">Error</h2>
        <p className="mt-2 text-slate-600">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center mt-12 px-4">
        <BookMarked className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-xl font-semibold text-slate-800">
          Book Not Found
        </h2>
        <p className="mt-2 text-slate-600">
          We couldn't find the book you were looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section with Decorative Background Icon */}
          <header className="p-8 relative border-b border-slate-200">
            <BookOpen
              className="absolute top-1/2 right-8 -translate-y-1/2 h-32 w-32 text-slate-100/80 -rotate-12"
              strokeWidth={1}
            />
            <div className="relative">
              {book.isNewArrival && (
                <span className="mb-2 inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full tracking-wide">
                  NEW ARRIVAL
                </span>
              )}
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {book.title}
              </h1>
              <div className="mt-2 text-lg text-slate-600">
                by <AuthorList authors={book.authors} inline />
              </div>
            </div>
          </header>

          <main className="p-8 space-y-10">
            {/* --- Availability & Location Section --- */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Status & Location
              </h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">
                    Current Status
                  </span>
                  <BookStatusBadge status={book.status} />
                </div>

                {book.status === "issued" && book.circulation && (
                  <div className="p-4 bg-white rounded-md border border-slate-200">
                    <div className="flex items-start gap-3">
                      <CalendarClock className="h-6 w-6 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800">
                          Currently Issued
                        </p>
                        <p className="text-sm text-slate-500">
                          Expected back on or after:{" "}
                          <strong>{formatDate(book.lastIssueDate)}</strong>
                        </p>
                        <p className="text-sm text-slate-500">
                          Issued to:{" "}
                          <strong>
                            {book.circulation.patron?.name || "Unknown"}
                          </strong>
                        </p>
                        <p className="text-sm text-slate-500">
                          Adm. No{" "}
                          <strong>
                            {book.circulation.patron?.admissionNumber ||
                              "Unknown"}
                          </strong>
                        </p>
                        <p className="text-sm text-slate-500">
                          Section{" "}
                          <strong>
                            {book.circulation.patron?.section?.name ||
                              "Unknown"}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4">
                  <MetadataItem
                    icon={Library}
                    label="Physical Location"
                    value={book.location?.name}
                  />
                </div>
              </div>
            </section>

            {/* --- Core Details Section --- */}
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Bibliographic Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                <MetadataItem
                  icon={BookMarked}
                  label="Call Number"
                  value={book.callNumber}
                />
                <MetadataItem
                  icon={Hash}
                  label="Accession No."
                  value={book.accNumber}
                />
                <MetadataItem icon={Info} label="ISBN" value={book.isbn} />
                <MetadataItem
                  icon={Building}
                  label="Publisher"
                  value={book.publisher?.name}
                />
                <MetadataItem
                  icon={Calendar}
                  label="Published Date"
                  value={moment(book.publishedDate).format("MMMM D, YYYY")}
                />
                <MetadataItem
                  icon={Info}
                  label="Edition"
                  value={book.edition}
                />
                <MetadataItem
                  icon={FileText}
                  label="Pages"
                  value={book.pages}
                />
                <MetadataItem
                  icon={Languages}
                  label="Language"
                  value={book.language?.name}
                />
              </div>
            </section>

            {/* --- Categories & Keywords Section --- */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  Categories
                </h3>
                <CategoryList categories={book.categories} />
              </div>
              {Array.isArray(book.keywords) && book.keywords.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
