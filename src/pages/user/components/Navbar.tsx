import { BookMarked, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Define the navigation links in a single array for consistency
const navLinks = [
  { name: "Catalog", to: "/catalog" },
  { name: "E-Resources", to: "/e-resources" },
  { name: "Events", to: "/events" },
  { name: "About Us", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Hook to get the current URL path

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Library Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <BookMarked className="h-8 w-8 text-indigo-600 transition-transform group-hover:rotate-[-10deg]" />
              <div className="flex flex-col leading-tight">
                 <span className="text-lg font-bold text-slate-800">
                   Dr. U Bapputty Haji
                 </span>
                 <span className="text-sm text-slate-500">
                    Memorial Library
                 </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                // Apply different styles if the link is active
                className={`font-medium transition-colors hover:text-indigo-600 ${
                  location.pathname === link.to
                    ? "text-indigo-600"
                    : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions: Login and Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
         

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-200 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={toggleMobileMenu} // Close menu on click
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
         
        </div>
      </div>
    </header>
  );
};

export default Navbar;