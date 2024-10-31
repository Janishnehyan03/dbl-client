import React, { useState } from "react";

interface Book {
  title: string;
  author: string;
  image: string;
  category: string;
}

const books: Book[] = [
  {
    title: "In the Footsteps of the Prophet",
    author: "Tariq Ramadan",
    image:
      "https://th.bing.com/th/id/OIP.0qxWWiv5uAS-T2OK11jpawHaLZ?w=208&h=308&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    category: "Biography",
  },
  {
    title: "The Sealed Nectar",
    author: "Safi-ur-Rahman al-Mubarakpuri",
    image:
      "https://i.pinimg.com/564x/f7/c8/12/f7c812c9b0296cd9f119e33a06d9a256.jpg",
    category: "History",
  },
  {
    title: "Purification of the Heart",
    author: "Hamza Yusuf",
    image:
      "https://www.ingramspark.com/hs-fs/hubfs/TheSumofAllThings_cover_June21_option4(1).jpg?width=1125&name=TheSumofAllThings_cover_June21_option4(1).jpg",
    category: "Philosophy",
  },
  {
    title: "Lost Islamic History",
    author: "Firas Alkhateeb",
    image:
      "https://miblart.com/wp-content/uploads/2020/01/crime-and-mystery-cover-scaled-1.jpeg",
    category: "History",
  },
];

const categories = [
  "All",
  "Biography",
  "History",
  "Philosophy",
  "Fantasy",
  "Drama",
];

const CategoriesCard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Filter books based on selected category
  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  return (
    <section className="m-10 p-6 bg-white shadow-md rounded-xl">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-800 font-bold uppercase">
         Categories
          </h2>
          <a href="#" className="text-blue-500 text-sm hover:underline">
            See All
          </a>
        </div>
        {/* Categories List */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-2xl ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } transition-colors duration-200 ease-in-out`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filtered Book Cards */}
        <div className="flex space-x-4 overflow-x-auto">
          {filteredBooks.map((book, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 bg-gray-100 rounded-lg shadow-lg"
            >
              {/* Book Image */}
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-40 object-cover rounded-t-lg mb-1"
              />
              {/* Title and Author */}
              <div className="p-2">
                <p className="text-gray-800 truncate text-sm">{book.title}</p>
                <p className="text-xs text-gray-500">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesCard;
