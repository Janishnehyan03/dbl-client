import React from "react";

// Sample announcements data
const announcements = [
  {
    id: 1,
    title: "Library System Maintenance",
    date: "2024-06-15",
    category: "System Update",
    description: "The library management system will undergo maintenance from 10 PM to 2 AM.",
  },
  {
    id: 2,
    title: "New Arrivals: Science Fiction",
    date: "2024-06-10",
    category: "New Books",
    description: "We have added a new collection of science fiction books to our shelves.",
  },
  {
    id: 3,
    title: "Reading Competition Announcement",
    date: "2024-06-05",
    category: "Events",
    description: "Join our upcoming reading competition and win exciting prizes!",
  },
  {
    id: 4,
    title: "Holiday Notice",
    date: "2024-06-01",
    category: "Notice",
    description: "The library will remain closed on public holidays. Plan your visits accordingly.",
  },
];

const AnnouncementsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-6 lg:px-16">
        <h1 className="text-4xl font-bold text-center text-teal-900 mb-8">
          Library Announcements
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Stay informed about the latest updates, events, and notices from the library.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <span className="text-sm text-white font-bold px-3 py-1 rounded-full bg-teal-500">
                {announcement.category}
              </span>
              <h2 className="text-2xl font-semibold text-gray-900 mt-4">
                {announcement.title}
              </h2>
              <p className="text-gray-600 mt-2 line-clamp-3">
                {announcement.description}
              </p>
              <div className="mt-4 text-gray-500 text-sm flex items-center justify-between">
                <span>📅 {announcement.date}</span>
                <button className="text-teal-700 font-medium hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
