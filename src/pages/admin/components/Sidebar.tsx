import {
  ArrowRight,
  Book,
  Building,
  DollarSign,
  FileText,
  LayoutDashboard,
  Lightbulb,
  LocateIcon,
  Menu,
  Settings,
  Share,
  UserCog2,
  Users
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useConfiguration } from "../../../utils/contexts/configurationContext";

const Sidebar: React.FC = () => {
  const { configuration } = useConfiguration();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard />, text: "Dashboard", path: "/admin" },
    {
      icon: <FileText />,
      text: "Book Issued/Return",
      path: "/book-issue-return",
    },
    { icon: <Users />, text: "Students", path: "/students" },
    { icon: <Book />, text: "Books", path: "/books" },
    { icon: <Share />, text: "Publishers", path: "/publishers" },
    { icon: <UserCog2 />, text: "Authors", path: "/authors" },
    { icon: <Menu />, text: "Categories", path: "/categories" },
    {
      icon: <LocateIcon />,
      text: "Location / Language",
      path: "/language-location",
    },
    { icon: <Building />, text: "Sections / Classes", path: "/sections" },
    { icon: <DollarSign />, text: "Fees pending", path: "/fees-pending" },
    { icon: <Lightbulb />, text: "Daily Quotes", path: "/daily-quotes" },
    { icon: <Settings />, text: "Configurations", path: "/configurations" },
  ];

  return (
    <div className="flex">
      <div
        className={`${isOpen ? "w-72" : "w-20"
          } h-screen p-5 pt-8 relative duration-300 backdrop-blur-md 
        bg-white bg-opacity-20 border-r border-white border-opacity-30 shadow-lg`}
      >
        <ArrowRight
          className={`absolute cursor-pointer -right-3 top-9 w-7 h-7 border border-opacity-50 rounded-full transition-all duration-300 transform ${isOpen ? "rotate-0" : "rotate-180"
            }`}
          onClick={() => setIsOpen(!isOpen)}
        />
        <Link to={`/`}>
          <div className="flex gap-x-4 items-center">
            <img
              src="/logo.png"
              alt="Library Logo"
              className={`h-10 transform transition-transform duration-500 ${isOpen && "rotate-[360deg]"
                }`}
            />
            <h1
              className={`text-gray-800 text-opacity-90 font-medium text-xl transition-transform duration-200 ${!isOpen && "scale-0"
                }`}
            >
              {configuration?.libraryName}
            </h1>
          </div>
        </Link>
        <ul className="pt-6">
          {menuItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`flex items-center p-3 my-2 rounded-md cursor-pointer transition-colors duration-200 ${location.pathname === item.path
                  ? "bg-gray-600 text-white"
                  : "text-gray-800 hover:bg-gray-500 hover:bg-opacity-20"
                }`}
            >
              <div
                className={`mr-3 ${location.pathname === item.path
                    ? "text-white"
                    : "text-gray-800"
                  }`}
              >
                {item.icon}
              </div>
              <span
                className={`flex-1 font-medium transition-all ${!isOpen && "hidden"
                  }`}
              >
                {item.text}
              </span>
              {location.pathname === item.path && isOpen && (
                <ArrowRight className="ml-auto text-white" />
              )}
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;