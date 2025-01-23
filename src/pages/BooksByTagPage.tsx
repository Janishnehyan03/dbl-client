import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import BookCard from "../components/BookCard";
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
      <h1 className="text-4xl font-bold  text-gray-800 text-center p-4 rounded-lg mb-4">
        #{tag}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BooksByTagPage;
