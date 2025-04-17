import {
  BookOpen,
  ChevronDown,
  CreditCard,
  FileText, // Replaces DollarSign
  Lamp,
  LayoutDashboard, // Replaces Book (for Catalog)
  MapPin, // Replaces Lightbulb
  MenuSquare,
  Settings,
  Share,
  UserCog2,
  Users
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useConfiguration } from "../../../../utils/contexts/configurationContext";

const Sidebar: React.FC = () => {
  const { configuration } = useConfiguration();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (menuText: string) => {
    setActiveDropdown(activeDropdown === menuText ? null : menuText);
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/admin" },
    {
      icon: <FileText size={20} />,
      text: "Circulation",
      hasDropdown: true,
      subItems: [
        { text: "Issue Books", path: "/circulation/issue" },
        { text: "Return Books", path: "/circulation/return" },
        { text: "Overdue List", path: "/circulation/overdue" },
      ],
    },
    { icon: <Users size={20} />, text: "Patrons", path: "/patrons" },
    {
      icon: <BookOpen size={20} />, // Updated icon for Catalog
      text: "Catalog",
      hasDropdown: true,
      subItems: [
        { text: "Books", path: "/catalog/books" },
        { text: "Add New Book", path: "/catalog/books/new" },
        { text: "Bulk Import", path: "/catalog/import" },
      ],
    },
    { icon: <Share size={20} />, text: "Publishers", path: "/publishers" },
    { icon: <UserCog2 size={20} />, text: "Authors", path: "/authors" },
    { icon: <MenuSquare size={20} />, text: "Categories", path: "/categories-page" }, // Updated icon for Categories
    {
      icon: <MapPin size={20} />, // Updated icon for Library Setup
      text: "Library Setup",
      hasDropdown: true,
      subItems: [
        { text: "Locations", path: "/setup/locations" },
        { text: "Languages", path: "/setup/languages" },
        { text: "Sections", path: "/setup/sections" },
      ],
    },
    { icon: <CreditCard size={20} />, text: "Fines", path: "/fines" }, // Updated icon for Fines
    { icon: <Lamp size={20} />, text: "Quotes", path: "/quotes" }, // Updated icon for Quotes
    {
      icon: <Settings size={20} />,
      text: "Settings",
      hasDropdown: true,
      subItems: [
        { text: "General", path: "/settings/general" },
        { text: "Users", path: "/settings/users" },
        { text: "Reports", path: "/settings/reports" },
        { text: "Access Control", path: "/settings/access-control" },
        { text: "Academics", path: "/settings/academics" },
      ],
    },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          isOpen ? "w-72" : "w-20"
        } h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 text-white p-5 pt-8 fixed transition-all duration-300 shadow-xl overflow-y-auto`}
      >
        {/* Logo and Library Name */}
        <Link to="/admin" className="flex items-center gap-x-4 mb-8">
          <img
            src="/logo.png"
            alt="Library Logo"
            className={`h-10 transition-transform duration-500 ${
              isOpen && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-xl font-semibold transition-all duration-200 origin-left whitespace-nowrap ${
              !isOpen && "scale-0"
            }`}
          >
            {configuration?.libraryName || "Library Admin"}
          </h1>
        </Link>

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <div
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  location.pathname === item.path ||
                  (item.subItems?.some((sub) =>
                    location.pathname.startsWith(sub.path)
                  ) &&
                    "bg-indigo-700")
                    ? "bg-indigo-700"
                    : "hover:bg-indigo-700/50"
                }`}
                onClick={() => item.hasDropdown && toggleDropdown(item.text)}
              >
                <Link
                  to={item.path || "#"}
                  className="flex items-center flex-1"
                >
                  <div className="mr-3">{item.icon}</div>
                  <span
                    className={`flex-1 font-medium transition-all duration-200 ${
                      !isOpen && "hidden"
                    }`}
                  >
                    {item.text}
                  </span>
                  {item.hasDropdown && isOpen && (
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform duration-200 ${
                        activeDropdown === item.text ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>
              </div>

              {/* Dropdown Submenu */}
              {item.hasDropdown && isOpen && activeDropdown === item.text && (
                <ul className="ml-10 mt-1 space-y-1">
                  {item.subItems?.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={subItem.path}
                        className={`block p-2 rounded-lg text-sm transition-all duration-200 ${
                          location.pathname === subItem.path
                            ? "bg-indigo-600 text-white"
                            : "hover:bg-indigo-600/50"
                        }`}
                      >
                        {subItem.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content spacer */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-20"
        }`}
      />
    </div>
  );
};

export default Sidebar;