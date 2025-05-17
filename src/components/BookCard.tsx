import { Link } from "react-router-dom";

function BookCard({
  book,
  isNewArrival,
}: {
  book: any;
  isNewArrival?: boolean;
}) {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all duration-200">
      <Link to={`/book/${book._id}`} className="block p-5">
        <div className="flex flex-col space-y-3">
          {/* Book Title and New Arrival Badge */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              {book.title}
            </h3>
            {isNewArrival && (
              <span className="px-2 py-1 text-xs font-bold text-white bg-indigo-600 rounded-full">
                New
              </span>
            )}
          </div>

          {/* Book Details */}
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">
                {book.authors && book.authors.length > 0
                  ? book.authors.map((author: any) => author.name).join(", ")
                  : "Unknown author"}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {book.publisher && (
                <div className="text-gray-700">
                  <span className="text-gray-500">Published by </span>
                  {book.publisher.name}
                </div>
              )}

              {book.publishedDate && (
                <div className="text-gray-700">
                  {new Date(book.publishedDate).getFullYear()}
                </div>
              )}

              {book.pageCount && (
                <div className="text-gray-700">
                  {book.pageCount} pages
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {book.categories.map((category: any, index: number) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Action Link */}
          <div className="pt-2 mt-2 border-t border-gray-100">
            <div className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
              <span className="text-sm font-medium">View details</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BookCard;