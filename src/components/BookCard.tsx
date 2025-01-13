import { Link } from "react-router-dom";

function BookCard({ book }: { book: any }) {

  return (
    <Link
      to={`/book/${book.id}`}
      className="block  transform transition-transform hover:scale-105 focus:scale-105"
    >
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden cursor-pointer p-4">
        {/* Book Details */}
        <h3
          className="text-xl font-bold text-gray-800 truncate"
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 my-3">
          {book.authors && book.authors.length > 0
            ? book.authors
                .map((author: any) => `${author.firstName} ${author.lastName}`)
                .join(", ")
            : "Unknown Author"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {book.publishers && book.publishers.length > 0
            ? book.publishers.map((publisher: any) => publisher.publisherName).join(", ")
            : "Unknown Publisher"}
        </p>
      </div>
    </Link>
  );
}

export default BookCard;
