import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import { Link } from "react-router-dom";
import BookSkeleton from "../../components/BookSkeleton";

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

const images = [
  "https://images.unsplash.com/photo-1539877254216-818ed7c76096?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1730055194055-2ecec719fa5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8",
  "https://images.unsplash.com/photo-1735656244152-5d0ad782f71d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8", "https://plus.unsplash.com/premium_photo-1690522330973-021425184c2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D", "https://plus.unsplash.com/premium_photo-1731680780948-249419f8cd50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMnx8fGVufDB8fHx8fA%3D%3D"];


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
  if (loading) return <div className="grid grid-cols-4 gap-4 m-10 p-6 ">
    {[...Array(4)].map((_, i) => <BookSkeleton key={i} />)}
  </div>

  return (
    <section className="m-10 p-6 rounded-xl">
      <div className="px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
            Categories
          </h2>
          <a
            href="#"
            className="text-blue-600 text-sm font-medium hover:underline focus:outline-none focus:ring focus:ring-blue-300 rounded"
          >
            See All
          </a>
        </div>

        {/* Categories List */}
        <div className="flex space-x-3 mb-6 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full border ${selectedCategory?._id === category._id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-200 text-gray-700 border-gray-300"
                } hover:bg-blue-500 hover:text-white focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-200`}
            >
              {category.categoryName}
            </button>
          ))}
        </div>

        {/* Filtered Book Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {!loading &&
            !error &&
            filteredBooks.map((book: any, i) => (
              <Link to={`/book/${book.id}`} key={i}>
                <div className="flex flex-col md:flex-row h-full border border-gray-200 bg-white rounded-lg overflow-hidden hover:border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-200">
                  {/* Book Details */}
                  <div className="p-4 space-y-3 flex-1">
                    {/* Book Title */}
                    <p
                      className="font-bold text-gray-800 truncate"
                      title={book.title}
                    >
                      {book.title.length > 28 ? `${book.title.substring(0, 28)}...` : book.title}
                    </p>

                    {/* Authors */}
                    <div className="text-sm text-gray-600 space-y-2">
                      <div>
                        {book.authors && book.authors.length > 0 ? (
                            <p className="truncate">
                            {book.authors[0]?.firstName || "Unknown Author"}
                            </p>
                        ) : (
                          <p className="italic text-gray-500">Unknown Author</p>
                        )}
                      </div>

                     
                    </div>
                  </div>

                  {/* Book Image */}
                  <img
                    src={images[i % images.length]}
                    alt={book.title}
                    className="h-28 w-20  object-fill"
                  />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>

  );
};

export default CategoriesCard;
