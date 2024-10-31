import React, { useEffect, useState } from "react";

const quotes = [
  {
    text: "A reader lives a thousand lives before he dies.",
    author: "George R.R. Martin",
  },
  {
    text: "The only thing that you absolutely have to know is the location of the library.",
    author: "Albert Einstein",
  },
  {
    text: "Reading is essential for those who seek to rise above the ordinary.",
    author: "Jim Rohn",
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
  },
];

const HeroSection: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white h-[60vh] flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-bold">
        Discover Your Next Favorite Book
      </h1>
      <p className="mt-4 text-lg sm:text-xl">
        Explore thousands of books across every genre, handpicked just for you.
      </p>

      {/* Quote Section */}
      <div
        key={currentQuote}
        className="bg-white bg-opacity-20 mt-8 p-6 rounded-lg shadow-lg backdrop-blur-md border border-white border-opacity-30 transition-opacity duration-700 ease-in-out animate-fade-in"
      >
        <p className="text-lg italic mb-2 text-white">{`"${quotes[currentQuote].text}"`}</p>
        <p className="text-sm font-semibold text-white">
          - {quotes[currentQuote].author}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
