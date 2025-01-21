import React, { useState } from "react";
import { useConfiguration } from "../../../utils/contexts/configurationContext";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const { configuration } = useConfiguration();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Manage mobile menu toggle

  // Toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-30">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
      <Link to="/">
        <h1 className="text-xl font-bold">{configuration?.libraryName}</h1>
      </Link>
      <nav className="space-x-6 hidden lg:flex">
        {["Home", "Catalog", "E-Resources", "Events", "Contact Us"].map(
        (item) => (
          <a
          key={item}
          href="#"
          className="text-gray-700 hover:text-black"
          >
          {item}
          </a>
        )
        )}
      </nav>
      <div className="space-x-4 flex items-center">
        <input
        type="text"
        placeholder="Search book..."
        className="border rounded-full px-4 py-2 text-sm"
        />
        <a href="#" className="text-gray-700 hover:text-black">
        Sign In
        </a>
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
      {["Home", "Catalog", "E-Resources", "Events", "Contact Us"].map((item) => (
        <a
        key={item}
        href="#"
        className="py-2 px-6 hover:text-blue-500 transition duration-300"
        onClick={toggleMobileMenu}
        >
        {item}
        </a>
      ))}
      </div>
    </header>
  );
};

export default Navbar;
