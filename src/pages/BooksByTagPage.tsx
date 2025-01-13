import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_BOOKS_BY_TAG } from "../graphql/queries/bookQuery";

interface Author {
  firstName: string;
  lastName: string;
}

interface Publisher {
  publisherName: string;
}

interface Language {
  languageName: string;
}

interface Category {
  categoryName: string;
}

interface Book {
  id: string;
  title: string;
  authors: Author[];
  publishers: Publisher[];
  language: Language;
  category: Category;
  tags: string[];
}

const BooksByTagPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const { data, loading, error } = useQuery(GET_BOOKS_BY_TAG, {
    variables: { tag },
  });

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error: {error.message}</p>;

  const books: Book[] = data.booksByTag;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold bg-teal-800 text-white text-center p-4 rounded-lg mb-4">
        #{tag}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Link
            to={`/book/${book.id}`}
            className="block transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            key={book.id}
          >
            <div className=" p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-teal-900 mb-3">
                {book.title}
              </h2>
              <p className="text-gray-700 mb-2">
                <span className="font-medium text-teal-800">Authors:</span>{" "}
                {book.authors
                  .map((author) => `${author.firstName} ${author.lastName}`)
                  .join(", ")}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium text-teal-800">Publishers:</span>{" "}
                {book.publishers
                  .map((publisher) => publisher.publisherName)
                  .join(", ")}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium text-teal-800">Category:</span>{" "}
                {book.category.categoryName}
              </p>
              <div className="mt-3 flex flex-wrap">
                {book.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 shadow-sm hover:bg-teal-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BooksByTagPage;
