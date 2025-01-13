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
    <header className="h-24 sm:h-32 flex items-center w-full bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Library Name */}
        <Link to="/">
          <div className="uppercase text-gray-800 font-black text-xl lg:text-3xl">
            {configuration?.libraryName}
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center">
          {/* Desktop Menu */}
          <nav className="font-sans text-gray-800 uppercase text-lg lg:flex items-center hidden">
            {["Home", "Catalog", "E-Resources", "Events", "Contact Us"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="py-2 px-6 hover:text-blue-500 transition duration-300"
                >
                  {item}
                </a>
              )
            )}
          </nav>

          {/* Hamburger Menu for Mobile */}
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

      {/* Mobile Menu */}
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
            onClick={toggleMobileMenu} // Close menu when an item is clicked
          >
            {item}
          </a>
        ))}
      </div>
    </header>
  );
};

export default Navbar;
