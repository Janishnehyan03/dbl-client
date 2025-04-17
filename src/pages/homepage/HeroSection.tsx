import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookOrder, setBookOrder] = useState([0, 1, 2, 3]);

  const books = [
    {
      title: "The Great Gatsby",
      authorName: "F. Scott Fitzgerald",
      image:
        "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww",
    },
    {
      title: "To Kill a Mockingbird",
      authorName: "Harper Lee",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww",
    },
    {
      title: "1984",
      authorName: "George Orwell",
      image:
        "https://images.unsplash.com/photo-1641154748135-8032a61a3f80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      title: "The Catcher in the Rye",
      authorName: "J.D. Salinger",
      image:
        "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setBookOrder((prevOrder: any) => {
        const newOrder = [...prevOrder];
        const topBook = newOrder.shift();
        newOrder.push(topBook);
        return newOrder;
      });
    }, 5000);

    return () => clearInterval(cycleInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Modern Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-800 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white rounded-full -top-48 -left-48 transform rotate-45"></div>
          <div className="absolute w-72 h-72 bg-indigo-400 rounded-full bottom-0 right-0 transform -rotate-45"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
                Explore Your
                <span className="block text-indigo-300">Next Great Read</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-indigo-100 max-w-md">
                Dive into a universe of stories, knowledge, and imagination
                waiting to be discovered.
              </p>
              <div className="mt-8 max-w-md mx-auto md:mx-0">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="h-6 w-6 text-indigo-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-indigo-300/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                    placeholder="Find books, authors, or topics..."
                  />
                  <button className="absolute inset-y-0 right-0 px-6 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
            {/* Right Book Stack */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-72 h-[28rem] perspective-1000">
                {bookOrder.map((bookIdx, index) => (
                  <div
                    key={bookIdx}
                    className={`absolute w-full transition-all duration-500 ease-in-out`}
                    style={{
                      zIndex: bookOrder.length - index,
                      transform: `translateY(${index * 20}px) translateZ(${
                        (bookOrder.length - index - 1) * 10
                      }px) rotate(${index % 2 === 0 ? 2 : -2}deg)`,
                      opacity: 1 - index * 0.2,
                    }}
                  >
                    <div className="rounded-xl overflow-hidden">
                      <img
                        src={books[bookIdx].image}
                        alt={books[bookIdx].title}
                        className="w-full h-80 object-cover"
                      />
                      <div className="p-4 bg-indigo-50">
                        <h3 className="text-lg font-semibold text-indigo-900 truncate">
                          {books[bookIdx].title}
                        </h3>
                        <p className="text-sm text-indigo-600">
                          {books[bookIdx].authorName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
