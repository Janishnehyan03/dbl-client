import { useQuery } from "@apollo/client";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { GET_BOOK_DETAILS } from "../graphql/queries/bookQuery";
import BookDetailsSkeleton from "../components/BookDetailsSkeleton";

interface Author {
  id: string;
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

interface Location {
  locationName: string;
}

interface Book {
  title: string;
  englishTitle: string;
  accNumber: string;
  callNumber: string;
  ISBN: string;
  description: string;
  numberOfPages: number;
  price: number;
  published: boolean;
  tags: string[];
  authors: Author[];
  publishers: Publisher[];
  language: Language;
  category: Category;
  location: Location;
  issuedBy: any;
  edition: string;
  coverImage: string;
}

const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { data, loading, error } = useQuery(GET_BOOK_DETAILS, {
    variables: { id: bookId },
  });

  if (loading) return <BookDetailsSkeleton />;
  if (error)
    return <p className="text-center text-red-600">Error: {error.message}</p>;

  const book: Book = data.book;

  return (
    <div className="container mx-auto p-10 max-w-6xl bg-white shadow-xl rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Book Image */}
        <div className="flex justify-center md:justify-start">
          <img
            src={book.coverImage ? book.coverImage : "https://img.freepik.com/free-photo/red-hardcover-book-front-cover_1101-833.jpg?ga=GA1.1.693543164.1727334307&semt=ais_incoming"}
            alt={book.title}
            className="rounded-lg shadow-lg w-full max-w-sm object-cover"
          />
        </div>

        {/* Book Details */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>
          {book.englishTitle && (
            <h2 className="text-xl text-gray-500 italic">{book.englishTitle}</h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-gray-700">
            <div>
              <p><span className="font-semibold text-gray-900">Author(s):</span> {book.authors.map((author, index) => (
                <React.Fragment key={index}>
                  <Link to={`/author/${author.id}`} className="text-gray-700 hover:underline">
                    {author.firstName} {author.lastName}
                  </Link>
                  {index < book.authors.length - 1 && ', '}
                </React.Fragment>
              ))}</p>
              <p><span className="font-semibold text-gray-900">Category:</span> {book.category?.categoryName}</p>
              <p><span className="font-semibold text-gray-900">Language:</span> {book.language?.languageName}</p>
              <p><span className="font-semibold text-gray-900">Location:</span> {book.location?.locationName}</p>
            </div>

            <div>
              <p><span className="font-semibold text-gray-900">Publisher(s):</span> {book.publishers.map(p => p.publisherName).join(', ')}</p>
              <p><span className="font-semibold text-gray-900">ISBN:</span> {book.ISBN}</p>
              <p><span className="font-semibold text-gray-900">Pages:</span> {book.numberOfPages}</p>
              <p><span className="font-semibold text-gray-900">Edition:</span> {book.edition} Edition</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">{book.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">Tags</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {book.tags.map((tag, index) => (
                <Link to={`/tag/${tag}`} key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {book.issuedBy && (
        <div className="bg-gray-100 p-8 rounded-lg shadow-md mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Issued By</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {book.issuedBy.studentName && <p><span className="font-semibold text-gray-900">Student Name:</span> {book.issuedBy.studentName}</p>}
            {book.issuedBy.teacherName && <p><span className="font-semibold text-gray-900">Teacher Name:</span> {book.issuedBy.teacherName}</p>}
            {book.issuedBy.class?.className && <p><span className="font-semibold text-gray-900">Class:</span> {book.issuedBy.class.className}</p>}
            {book.issuedBy.section?.sectionName && <p><span className="font-semibold text-gray-900">Section:</span> {book.issuedBy.section.sectionName}</p>}
            {book.issuedBy.admissionNumber && <p><span className="font-semibold text-gray-900">Admission Number:</span> {book.issuedBy.admissionNumber}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
