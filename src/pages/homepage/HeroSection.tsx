import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Book {
  title: string;
  author: string;
  cover: string;
  id?: string;
}

const HeroSection: React.FC = () => {
  const booksSet: Book[][] = [
    [
      {
        title: "1984",
        author: "George Orwell",
        cover: "https://images.unsplash.com/photo-1735656244152-5d0ad782f71d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        cover: "https://images.unsplash.com/photo-1735287367310-2648443f086f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        cover: "https://images.unsplash.com/photo-1735408928209-16a5d6ba8ccf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    [
      {
        title: "Moby Dick",
        author: "Herman Melville",
        cover: "https://images.unsplash.com/photo-1735597821463-05f8cbd08fca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        cover: "https://plus.unsplash.com/premium_photo-1668447598676-30bbd44792c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "War and Peace",
        author: "Leo Tolstoy",
        cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8",
      },
    ],
  ];

  const [currentBooksIndex, setCurrentBooksIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBooksIndex((prevIndex) => (prevIndex + 1) % booksSet.length);
    }, 8000); // Change books every 8 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [booksSet.length]);

  const currentBooks = booksSet[currentBooksIndex];

  return (
    <div className="font-sans min-h-screen flex items-center justify-center">
      <main className="container mx-auto px-6 md:px-12 lg:px-24 py-16">
        <section className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-16">
          {/* Text Section */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-gray-800">
              Find Your Next Book
            </h2>
            <p className="text-gray-600 mb-8 text-lg md:text-xl">
              Our most popular and trending <span className="font-semibold">On.Book</span> perfect. Not sure what to read next? Find your reading mood.
            </p>
          
          </div>

          {/* Books Section */}
          <div className="md:w-1/2 flex space-x-4 overflow-hidden">
            {currentBooks.map((book, index) => (
              <div
                key={book.title}
                className={`w-full md:w-1/3 p-2 transform transition-transform duration-500 ease-in-out ${currentBooksIndex % 2 === 0
                  ? "animate-fadeInUp"
                  : "animate-fadeInDown"
                  }`}
              >
                <Link to={`/book/${book.id}`} className="block cursor-pointer">
                  <div
                    className={`overflow-hidden ${index === 1 ? "rounded-b-full" : "rounded-t-full"
                      }`}
                  >
                    {index === 1 && (
                      <div className="p-4 text-center text-sm ">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-gray-600">{book.author}</p>
                      </div>
                    )}
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                    {index !== 1 && (
                      <div className="p-4 text-center text-sm ">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-gray-600">{book.author}</p>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HeroSection;
