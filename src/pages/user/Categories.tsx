import React from "react";
import { Link } from "react-router-dom";

// Dummy categories data
const categories = [
  { name: "Fiction", bgColor: "bg-gradient-to-r from-teal-500 to-blue-500" },
  { name: "Non-fiction", bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500" },
  { name: "Science", bgColor: "bg-gradient-to-r from-green-500 to-cyan-500" },
  { name: "Technology", bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500" },
  { name: "History", bgColor: "bg-gradient-to-r from-red-500 to-pink-500" },
  { name: "Languages", bgColor: "bg-gradient-to-r from-gray-500 to-gray-700" },
];

const CategoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-6 lg:px-16">
        <h1 className="text-4xl font-bold text-center text-teal-900 mb-8">
          Explore Our Categories
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Browse books across various categories and find your next great read.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.name.toLowerCase()}`}
              className={`relative ${category.bgColor} rounded-lg shadow-lg p-8 text-white transform hover:scale-105 transition-all duration-300`}
            >
              {/* <div className="text-6xl">{category.icon}</div> */}
              <h2 className="text-2xl font-bold mt-4">{category.name}</h2>
              <p className="text-white/80 mt-2">
                Explore books in {category.name} category.
              </p>
              <div className="absolute bottom-4 right-4 text-xl font-bold opacity-80">
                →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
