import React from "react";

interface Book {
  title: string;
  author: string;
  image: string;
}

const books: Book[] = [
  {
    title: "In the Footsteps of the Prophet",
    author: "Tariq Ramadan",
    image: "https://th.bing.com/th/id/OIP.0qxWWiv5uAS-T2OK11jpawHaLZ?w=208&h=308&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  },
  {
    title: "The Sealed Nectar",
    author: "Safi-ur-Rahman al-Mubarakpuri",
    image: "https://i.pinimg.com/564x/f7/c8/12/f7c812c9b0296cd9f119e33a06d9a256.jpg",
  },
  {
    title: "Purification of the Heart",
    author: "Hamza Yusuf",
    image: "https://www.ingramspark.com/hs-fs/hubfs/TheSumofAllThings_cover_June21_option4(1).jpg?width=1125&name=TheSumofAllThings_cover_June21_option4(1).jpg",
  },
  {
    title: "Lost Islamic History",
    author: "Firas Alkhateeb",
    image: "https://miblart.com/wp-content/uploads/2020/01/crime-and-mystery-cover-scaled-1.jpeg",
  },
  {
    title: "In the Footsteps of the Prophet",
    author: "Tariq Ramadan",
    image: "https://th.bing.com/th/id/OIP.0qxWWiv5uAS-T2OK11jpawHaLZ?w=208&h=308&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  },
  {
    title: "The Sealed Nectar",
    author: "Safi-ur-Rahman al-Mubarakpuri",
    image: "https://i.pinimg.com/564x/f7/c8/12/f7c812c9b0296cd9f119e33a06d9a256.jpg",
  },
  {
    title: "Purification of the Heart",
    author: "Hamza Yusuf",
    image: "https://www.ingramspark.com/hs-fs/hubfs/TheSumofAllThings_cover_June21_option4(1).jpg?width=1125&name=TheSumofAllThings_cover_June21_option4(1).jpg",
  },
  {
    title: "Lost Islamic History",
    author: "Firas Alkhateeb",
    image: "https://miblart.com/wp-content/uploads/2020/01/crime-and-mystery-cover-scaled-1.jpeg",
  },
  {
    title: "The Sealed Nectar",
    author: "Safi-ur-Rahman al-Mubarakpuri",
    image: "https://i.pinimg.com/564x/f7/c8/12/f7c812c9b0296cd9f119e33a06d9a256.jpg",
  },
  {
    title: "Lost Islamic History",
    author: "Firas Alkhateeb",
    image: "https://miblart.com/wp-content/uploads/2020/01/crime-and-mystery-cover-scaled-1.jpeg",
  },
  {
    title: "Purification of the Heart",
    author: "Hamza Yusuf",
    image: "https://www.ingramspark.com/hs-fs/hubfs/TheSumofAllThings_cover_June21_option4(1).jpg?width=1125&name=TheSumofAllThings_cover_June21_option4(1).jpg",
  },
  {
    title: "Lost Islamic History",
    author: "Firas Alkhateeb",
    image: "https://miblart.com/wp-content/uploads/2020/01/crime-and-mystery-cover-scaled-1.jpeg",
  },
];

const NewArrivals: React.FC = () => {
  return (
    <section className="m-10 p-6 bg-white shadow-md rounded-xl">
      <div className="max-w-full px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-800 font-bold uppercase">New Arrivals</h2>
          <a href="#" className="text-blue-500 text-sm hover:underline">
            See All
          </a>
        </div>

        {/* Book Cards in a Single Line, Responsive */}
        <div className="lg:grid lg:grid-cols-6 gap-3">
          {books.map((book, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 bg-gray-200 rounded-lg shadow-lg hover:scale-105 transition cursor-pointer"
            >
              {/* Book Image */}
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-60 object-cover rounded-t-lg mb-2"
              />
              {/* Title and Author */}
              <div className="p-3">
                <p className="text-gray-800 truncate">
                  {book.title}
                  <span className="text-gray-400">...</span>
                </p>
                <p className="text-sm text-gray-500">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
