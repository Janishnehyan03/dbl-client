import { useQuery } from "@apollo/client";
import { BookIcon, FileTextIcon, TagIcon, UserIcon } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { GET_BOOK_DETAILS } from "../graphql/queries/bookQuery";

interface Author {
  id:string;
  firstName: string;
  lastName: string;
}

interface Publisher {
  name: string;
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
}

const BookDetailsPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { data, loading, error } = useQuery(GET_BOOK_DETAILS, {
    variables: { id: bookId },
  });

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error: {error.message}</p>;

  const book: Book = data.book;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold text-teal-800 text-center mb-6">
        {book.title}
      </h1>
      {book.englishTitle && (
        <h2 className="text-xl text-gray-600 italic text-center mb-6">
          {book.englishTitle}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1 */}
        <div className="space-y-4 text-lg text-gray-800">
          <div className="flex items-center">
            <UserIcon className="w-6 h-6 text-teal-600 mr-2" />
            <span className="font-semibold">Authors:</span>
            <span className="ml-2">
              {book.authors.map((author, index) => (
                <React.Fragment key={index}>
                  <Link
                    to={`/author/${author.id}`}
                    className="text-teal-600 hover:underline"
                  >
                    {author.firstName} {author.lastName}
                  </Link>
                  {index < book.authors.length - 1 && ", "}
                </React.Fragment>
              ))}
            </span>
          </div>

          <div className="flex items-center">
            <BookIcon className="w-6 h-6 text-teal-600 mr-2" />
            <span className="font-semibold">Category:</span>
            <span className="ml-2">{book.category?.categoryName}</span>
          </div>

          <div className="flex items-center">
            <FileTextIcon className="w-6 h-6 text-teal-600 mr-2" />
            <span className="font-semibold">Location:</span>
            <span className="ml-2">{book.location?.locationName}</span>
          </div>

          <div className="flex items-center">
            <TagIcon className="w-6 h-6 text-teal-600 mr-2" />
            <span className="font-semibold">Language:</span>
            <span className="ml-2">{book.language?.languageName}</span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4 text-lg text-gray-800">
          <div className="flex items-center">
            <UserIcon className="w-6 h-6 text-teal-600 mr-2" />
            <span className="font-semibold">Publishers:</span>
            <span className="ml-2">
              {book.publishers
                .map((publisher: any) => publisher?.publisherName)
                .join(", ")}
            </span>
          </div>

          <div className="flex items-center">
            <TagIcon className="w-6 h-6 text-teal-600 mr-2" />
            <span className="font-semibold">ISBN:</span>
            <span className="ml-2">{book.ISBN}</span>
          </div>

          <div className="flex items-center">
            <FileTextIcon className="w-6 h-6 text-teal-600 mr-2" />
            <span className="font-semibold">Pages:</span>
            <span className="ml-2">{book.numberOfPages}</span>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-8 space-y-4 text-lg text-gray-800">
        <div className="flex items-center">
          <span className="font-semibold">Status:</span>
          <span
            className={`ml-2 ${book.published ? "text-green-600" : "text-red-600"}`}
          >
            {book.published ? "Published" : "Not Published"}
          </span>
        </div>

        <div>
          <span className="font-semibold">Description:</span>
          <p className="ml-2 text-gray-700">{book.description}</p>
        </div>

        <div>
          <span className="font-semibold">Tags:</span>
          <div className="ml-2 flex flex-wrap gap-2 mt-1">
            {book.tags.map((tag: string, index: number) => (
              <Link to={`/tag/${tag}`}>
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm hover:bg-gray-300"
                >
                  #{tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
        {book.issuedBy && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-semibold text-teal-800 mb-4">
              Issued By
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {book.issuedBy.studentName && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700">
                    Student Name:
                  </span>
                  <span className="ml-2 text-gray-700">
                    {book.issuedBy.studentName}
                  </span>
                </div>
              )}
              {book.issuedBy.teacherName && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700">
                    Teacher Name:
                  </span>
                  <span className="ml-2 text-gray-700">
                    {book.issuedBy.teacherName}
                  </span>
                </div>
              )}
              {book.issuedBy.class?.className && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700">Class:</span>
                  <span className="ml-2 text-gray-700">
                    {book.issuedBy.class.className}
                  </span>
                </div>
              )}
              {book.issuedBy.section?.sectionName && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700">Section:</span>
                  <span className="ml-2 text-gray-700">
                    {book.issuedBy.section.sectionName}
                  </span>
                </div>
              )}

              {book.issuedBy.admissionNumber && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700">
                    Admission Number:
                  </span>
                  <span className="ml-2 text-gray-700">
                    {book.issuedBy.admissionNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailsPage;
