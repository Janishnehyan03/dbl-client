import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import { Link } from "react-router-dom";

// GraphQL Query for fetching books
const GET_BOOKS_BY_CATEGORY = gql`
  query GetBooksByCategory($category: ID!) {
    booksByCategory(category: $category) {
      id
      title
      publishers {
        publisherName
        id
      }
      authors {
        firstName
      }
      category {
        categoryName
      }
    }
  }
`;

interface Category {
  _id?: string;
  categoryName: string;
}

interface Book {
  title: string;
  authors: [{ firstName: string }];
  image: string;
  category: string;
}

const CategoriesCard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Initialize as an empty array
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  ); // Handle selectedCategory state

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get("/categories");
        const fetchedCategories: Category[] = response.data;

        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0]); // Automatically select the first category
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // GraphQL query for books based on the selected category
  const { data, loading, error } = useQuery(GET_BOOKS_BY_CATEGORY, {
    variables: {
      category: selectedCategory?._id || "", // Pass category _id when selected
    },
    skip: !selectedCategory, // Skip query if no category is selected
  });

  const filteredBooks: Book[] = data?.booksByCategory || []; // Display books from query result

  return (
    <section className="m-10 p-6 bg-white shadow-md rounded-xl">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-800 font-bold uppercase">
            Categories
          </h2>
          <a href="#" className="text-blue-500 text-sm hover:underline">
            See All
          </a>
        </div>

        {/* Categories List */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-2xl ${
                selectedCategory?._id === category._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } transition-colors duration-200 ease-in-out`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>

        {/* Filtered Book Cards */}
        <div className="flex space-x-4 overflow-x-auto">
          {loading && <p>Loading...</p>}
          {error && <p>Error fetching books</p>}
          {!loading &&
            !error &&
            filteredBooks.map((book: any, i) => (
              <Link to={`/book/${book.id}`}>
                <div
                  key={i}
                  className="flex-shrink-0 my-2 w-60 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Book Details */}
                  <div className="p-4 space-y-2">
                    {/* Book Title */}
                    <p
                      className="text-lg font-bold text-gray-800 truncate"
                      title={book.title}
                    >
                      {book.title}
                    </p>

                    {/* Authors */}
                    <div className="text-xs text-gray-600 space-y-4">
                      {/* Authors */}
                      <div className="space-y-1">
                        <p className="font-medium text-gray-700">Author(s):</p>
                        {book.authors && book.authors.length > 0 ? (
                          <p className="truncate">
                            {book.authors
                              .map(
                                (author: any) =>
                                  `${author.firstName} ${author.lastName || ""}`
                              )
                              .join(", ")}
                          </p>
                        ) : (
                          <p className="italic text-gray-500">Unknown Author</p>
                        )}
                      </div>

                      {/* Publishers */}
                      <div className="space-y-1">
                        <p className="font-medium text-gray-700">
                          Publisher(s):
                        </p>
                        {book.publishers && book.publishers.length > 0 ? (
                          <p className="truncate">
                            {book.publishers
                              .map((publisher: any) => publisher.publisherName)
                              .join(", ")}
                          </p>
                        ) : (
                          <p className="italic text-gray-500">
                            Unknown Publisher
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesCard;
