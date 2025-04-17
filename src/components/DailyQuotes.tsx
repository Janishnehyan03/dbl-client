import { useEffect, useState } from "react";
import Axios from "../utils/Axios";

interface Quote {
  text: string;
  author: string;
}

const DailyQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await Axios.get("/quotes");
        setQuotes(response.data);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [quotes]);

  if (quotes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg font-medium animate-pulse">
          Loading quotes...
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto my-12 px-6 py-10 bg-white rounded-2xl shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
      <div className="relative z-10 text-center">
        <blockquote className="transition-opacity duration-1000 ease-in-out">
          <p
            className={`text-xl md:text-2xl text-gray-800 leading-relaxed ${
              /[\u0600-\u06FF]/.test(quotes[currentIndex]?.text)
                ? "font-arabic"
                : /[\u0D00-\u0D7F]/.test(quotes[currentIndex]?.text)
                ? "font-malayalam"
                : /[\u0600-\u06FF]/.test(quotes[currentIndex]?.text)
                ? "font-urdu"
                : "font-dmsans"
            }`}
          >
            "{quotes[currentIndex]?.text}"
          </p>
          <cite className="block mt-4 text-lg font-semibold text-indigo-600 not-italic">
            — {quotes[currentIndex]?.author || "Unknown"}
          </cite>
        </blockquote>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0 Q50 50 100 0 T200 100 L0 100 Z"
            fill="url(#grad)"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#4f46e5", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#818cf8", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {quotes.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-indigo-600 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default DailyQuotes;