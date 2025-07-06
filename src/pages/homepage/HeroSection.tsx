import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Define a type for our book data for better code safety
export type Book = {
  id: number;
  title: string;
  author: string;
  image: string;
  genre: string;
  year: number;
  rating: number; // Rating out of 5
  description: string;
};

// Expanded and more detailed book data
const books: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    image:
      "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=800&auto=format&fit=crop&q=60",
    genre: "Classic",
    year: 1925,
    rating: 4,
    description:
      "A novel about the American dream, decadence, and idealism in the Jazz Age.",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=60",
    genre: "Fiction",
    year: 1960,
    rating: 5,
    description:
      "A profound story of racial injustice and the loss of innocence in the American South.",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    image:
      "https://images.unsplash.com/photo-1641154748135-8032a61a3f80?w=800&auto=format&fit=crop&q=60",
    genre: "Dystopian",
    year: 1949,
    rating: 5,
    description:
      "A chilling prophecy about the future and a timeless cautionary tale.",
  },
  {
    id: 4,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    image:
      "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=800&auto=format&fit=crop&q=60",
    genre: "Fiction",
    year: 1951,
    rating: 3,
    description:
      "A classic novel about teenage angst, rebellion, and alienation.",
  },
  {
    id: 5,
    title: "Dune",
    author: "Frank Herbert",
    image:
      "https://images.unsplash.com/photo-1608178388486-75cf3e477b5b?w=800&auto=format&fit=crop&q=60",
    genre: "Sci-Fi",
    year: 1965,
    rating: 5,
    description:
      "An epic science fiction saga of politics, religion, and power on a desert planet.",
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image:
      "https://images.unsplash.com/photo-1619802241126-66989f18a6e4?w=800&auto=format&fit=crop&q=60",
    genre: "Romance",
    year: 1813,
    rating: 4,
    description:
      "A witty and romantic novel of manners in 19th-century England.",
  },
];

function HeroSection() {
  const [bookOrder, setBookOrder] = useState(books.map((book) => book.id));
  const [isFading, setIsFading] = useState(false);

  // The current book is always the first one in the order
  const currentBook = books.find((b) => b.id === bookOrder[0])!;

  // The cycling animation logic
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsFading(true); // Start fade-out animation for text

      // After a short delay, update the book order and fade back in
      setTimeout(() => {
        setBookOrder((prevOrder) => {
          const newOrder = [...prevOrder];
          const topBookId = newOrder.shift();
          if (topBookId) newOrder.push(topBookId);
          return newOrder;
        });
        setIsFading(false); // Start fade-in animation
      }, 300); // This duration should be less than the transition duration
    }, 5000); // Change book every 5 seconds

    return () => clearInterval(cycleInterval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* === Left Content: DYNAMIC Book Info === */}
          <div className="relative z-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-600">
              Featured This Week
            </h2>

            {/* Animated container for text content */}
            <div
              key={currentBook.id}
              className={`mt-4 transition-opacity duration-300 ease-in-out ${
                isFading ? "opacity-0" : "opacity-100"
              }`}
            >
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {currentBook.title}
              </h1>
              <p className="mt-2 text-lg font-medium text-slate-700">
                by {currentBook.author}
              </p>

              <p className="mt-4 text-slate-600 max-w-lg leading-relaxed">
                {currentBook.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex items-center gap-4">
              <Link to={`/book/${currentBook.id}`}>
                <button className="bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-all transform hover:scale-105">
                  View Details
                </button>
              </Link>
            </div>
          </div>

          {/* === Right Content: Animated Book Stack === */}
          <div className="flex items-center justify-center h-full">
            <div className="relative w-64 sm:w-72 h-[28rem] perspective-1200">
              {bookOrder.map((bookId, index) => {
                const book = books.find((b) => b.id === bookId);
                if (!book) return null;

                const isFrontBook = index === 0;

                return (
                  <div
                    key={book.id}
                    className="absolute w-full h-full transition-all duration-700 ease-in-out transform-style-3d"
                    style={{
                      zIndex: books.length - index,
                      transform: isFrontBook
                        ? "translateX(0) scale(1.05) rotateY(0deg) rotateZ(0deg)" // Front book is centered
                        : `translateX(${index * 50}px) scale(${
                            1 - index * 0.1
                          }) rotateY(-30deg) rotateZ(${index * 2}deg)`,
                      opacity: 1 - index * 0.2,
                    }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg shadow-2xl shadow-slate-400/30"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
