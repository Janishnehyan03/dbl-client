import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_BOOKS_BY_AUTHOR } from "../graphql/queries/bookQuery";

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

const BooksByAuthorPage: React.FC = () => {
  const { author } = useParams<{ author: string }>();
  const { data, loading, error } = useQuery(GET_BOOKS_BY_AUTHOR, {
    variables: { author },
  });

  console.log("====================================");
  console.log(data);
  console.log("====================================");

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  const books: Book[] = data.booksByAuthor;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-center p-4 rounded-lg mb-6 shadow-md">
  Books by{" "}
  {data.booksByAuthor[0].authors.some((a: any) => a.id === author)
    ? data.booksByAuthor[0].authors.find((a: any) => a.id === author)?.firstName +
      " " +
      data.booksByAuthor[0].authors.find((a: any) => a.id === author)?.lastName
    : "Unknown Author"}
</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Link
            to={`/book/${book.id}`}
            className="block transform transition duration-300 hover:scale-105 hover:shadow-xl"
            key={book.id}
          >
            <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-indigo-500">
              <h2 className="text-xl font-bold text-indigo-400 mb-3">
                {book.title}
              </h2>
              <p className="text-gray-300 mb-2">
                <span className="font-medium text-indigo-500">Authors:</span>{" "}
                {book.authors
                  .map((author) => `${author.firstName} ${author.lastName}`)
                  .join(", ")}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-medium text-indigo-500">Publishers:</span>{" "}
                {book.publishers
                  .map((publisher) => publisher.publisherName)
                  .join(", ")}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-medium text-indigo-500">Category:</span>{" "}
                {book.category.categoryName}
              </p>
              <div className="mt-3 flex flex-wrap">
                {book.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 shadow-sm hover:bg-indigo-500"
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

export default BooksByAuthorPage;
