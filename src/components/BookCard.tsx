import { Link } from "react-router-dom";

function BookCard({
  book,
  isNewArrival,
}: {
  book: any;
  isNewArrival?: boolean;
}) {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/book/${book._id}`} className="block p-6">
        <div className="flex flex-col space-y-4">
          {/* New Arrival Image */}
          {isNewArrival && (
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1539877254216-818ed7c76096?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                alt={book.title}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
              <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                New Arrival
              </span>
            </div>
          )}

          {/* Book Title with Gradient */}
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {book.title}
          </h3>

          {/* Book Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-semibold text-gray-500">
                Author(s):{" "}
              </span>
              <span className="text-sm text-gray-900">
                {book.authors && book.authors.length > 0
                  ? book.authors.map((author: any) => author.name).join(", ")
                  : "Unknown"}
              </span>
            </div>

            {book.publisher && (
              <div>
                <span className="text-sm font-semibold text-gray-500">
                  Publisher:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {book.publisher.name}
                </span>
              </div>
            )}

            {book.publishedDate && (
              <div>
                <span className="text-sm font-semibold text-gray-500">
                  Published:{" "}
                </span>
                <span className="text-sm text-gray-900">
                  {new Date(book.publishedDate).getFullYear()}
                </span>
              </div>
            )}

            {book.pageCount && (
              <div>
                <span className="text-sm font-semibold text-gray-500">
                  Pages:{" "}
                </span>
                <span className="text-sm text-gray-900">{book.pageCount}</span>
              </div>
            )}
          </div>

          {/* Categories */}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.categories.map((category: any, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors">
              Explore Book
            </span>
            <div className="flex items-center space-x-2 text-indigo-500 group-hover:text-indigo-700 transition-colors">
              <span className="text-sm font-medium">Details</span>
              <svg
                className="w-5 h-5"
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
