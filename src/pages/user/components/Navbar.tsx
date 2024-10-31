import React from "react";

const Navbar: React.FC = () => {
  return (
    <header className="h-24 sm:h-32 flex items-center z-30 w-full bg-white shadow-md">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Library Name */}
        <div className="uppercase text-gray-800 font-black text-xl lg:text-3xl">
          Dr. Bapputty Haji Library
        </div>

        {/* Navigation Links */}
        <div className="flex items-center">
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
          <button className="lg:hidden flex flex-col ml-4">
            <span className="w-6 h-1 bg-gray-800 mb-1"></span>
            <span className="w-6 h-1 bg-gray-800 mb-1"></span>
            <span className="w-6 h-1 bg-gray-800 mb-1"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
