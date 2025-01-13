import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "../../utils/Axios";

interface Quote {
  text: string;
  author: string;
}

const HeroSection: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState(0);

  const fetchQuotes = async () => {
    try {
      const response = await Axios.get("/dailyQuotes");
      setQuotes(response.data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(quoteInterval);
  }, [quotes]);

  return (
    <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-20 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-bold mb-4">
        Discover Your Next Favorite Book
      </h1>
      <p className="text-lg sm:text-xl mb-8">
        Explore thousands of books across every genre, handpicked just for you.
      </p>

      {/* Quote Section */}
      {quotes.length > 0 && (
        <div
          key={currentQuote}
          className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg backdrop-blur-md border border-white border-opacity-30 transition-opacity duration-700 ease-in-out animate-fade-in"
        >
          <p className="text-lg italic mb-2 text-white">
            {`"${quotes[currentQuote].text}"`}
          </p>
          <p className="text-sm font-semibold text-white">
            - {quotes[currentQuote].author}
          </p>
        </div>
      )}
      <Link to={`/search`}>
        <div className="flex items-center bg-white px-4 py-2 text-blue-800 rounded-3xl mt-3 border border-white hover:bg-transparent hover:text-white">
          <Search />
          <button className="ml-2">Search Books</button>
        </div>
      </Link>
    </section>
  );
};

export default HeroSection;
