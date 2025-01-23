import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Manage mobile menu toggle

  // Toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/">
          <h1 className="text-xl font-bold">
            Dr. U Bapputty Haji Library
          </h1>
        </Link>
        <nav className="space-x-6 hidden lg:flex">
            {[
            { name: "Home", url: "/" },
            { name: "Search Books", url: "/search" },
            { name: "Categories", url: "/categories" },
            { name: "Announcements", url: "/announcements" },
            { name: "Contact Us", url: "/contact-us" },
            ].map((item) => (
            <Link
              key={item.name}
              to={item.url}
              className="text-gray-700 hover:text-black"
            >
              {item.name}
            </Link>
            ))}
        </nav>
        <div className="space-x-4 flex items-center">
          <input
            type="text"
            placeholder="Search book..."
            className="border border-gray-400 rounded-full px-4 py-2 text-sm w-full lg:w-auto"
          />
          <button
            className="lg:hidden flex flex-col ml-4"
            onClick={toggleMobileMenu}
          >
            <span className="w-6 h-1 bg-gray-800 mb-1"></span>
            <span className="w-6 h-1 bg-gray-800 mb-1"></span>
            <span className="w-6 h-1 bg-gray-800 mb-1"></span>
          </button>
        </div>
      </div>
      <div
        className={`lg:hidden flex flex-col items-center bg-white shadow-md w-full absolute top-0 left-0 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {[
          { name: "Home", url: "/" },
          { name: "Catalog", url: "/catalog" },
          { name: "E-Resources", url: "/e-resources" },
          { name: "Events", url: "/events" },
          { name: "Contact Us", url: "/contact" },
        ].map((item) => (
          <Link
            key={item.name}
            to={item.url}
            className="py-2 px-6 hover:text-blue-500 transition duration-300"
            onClick={toggleMobileMenu}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Navbar;