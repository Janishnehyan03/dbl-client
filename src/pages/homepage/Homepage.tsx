import React from "react";
import NewArrivals from "./NewArrivals";
import CategoriesCard from "./CategoriesCard";
import HeroSection from "./HeroSection";

const HomePage: React.FC = () => {
  return (
    <main className="bg-gray-50 text-gray-800 h-screen overflow-auto">
      {/* Hero Section */}
      <HeroSection />

      {/* Recommended Books Carousel */}
      <NewArrivals />

      {/* Categories Grid */}
      <CategoriesCard />

      {/* Trending Books */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">Trending Books</h2>
        <div className="flex overflow-x-auto space-x-6 scrollbar-hide">
          {/* Trending Book Card */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="min-w-[200px] bg-white rounded-lg shadow-lg p-4"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Trending Book Cover"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold">Trending Book {i + 1}</h3>
              <p className="text-gray-700 mt-2">Description of the book.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Author */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">Featured Author</h2>
        <div className="flex flex-col items-center bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <img
            src="https://via.placeholder.com/100"
            alt="Author"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h3 className="text-xl font-bold">Author Name</h3>
          <p className="text-gray-700 mt-2">
            "Inspirational quote from the author here."
          </p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
            See More by This Author
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
