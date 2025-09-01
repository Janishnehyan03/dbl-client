import { useEffect, useState } from "react";

const books = [
  {
    id: 1,
    image: "/images/banner1.png",
  },
  {
    id: 2,
    image: "/images/banner2.png",
  },
  {
    id: 3,
    image: "/images/banner3.png",
  },
];

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % books.length);
    }, 4000); // change image every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-gray-900 overflow-hidden">
      {books.map((book, index) => (
        <img
          key={book.id}
          src={book.image}
          alt={`Banner Slide ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    
    </section>
  );
}

export default HeroSection;
