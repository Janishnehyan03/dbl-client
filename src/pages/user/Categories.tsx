import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "../../utils/Axios";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import { ICategory } from "../../utils/types";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Color gradients for categories
  const colorGradients = [
    "bg-gradient-to-r from-teal-500 to-blue-500",
    "bg-gradient-to-r from-purple-500 to-indigo-500",
    "bg-gradient-to-r from-green-500 to-cyan-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "bg-gradient-to-r from-red-500 to-pink-500",
    "bg-gradient-to-r from-gray-500 to-gray-700",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get("/categories");
        const categoriesWithColors = response.data.map(
          (category: ICategory, index: number) => ({
            ...category,
            bgColor: colorGradients[index % colorGradients.length], // Cycle through colors
          })
        );
        setCategories(categoriesWithColors);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
        <FeedbackMessage type="error" message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-6 lg:px-16">
        <h1 className="text-4xl font-bold text-center text-teal-900 mb-8">
          Explore Our Categories
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Browse books across various categories and find your next great read.
        </p>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((category: any) => (
              <Link
                key={category._id}
                to={`/category/${category._id}`} // Using ID instead of name for URL
                className={`relative ${category.bgColor} rounded-lg shadow-lg p-8 text-white transform hover:scale-105 transition-all duration-300 min-h-[200px] flex flex-col`}
              >
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-white/80 mt-2 flex-grow">
                  {category.description ||
                    `Explore books in ${category.name} category.`}
                </p>
                <div className="absolute bottom-4 right-4 text-xl font-bold opacity-80">
                  →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
