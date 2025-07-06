import { ArrowRight, Book, IndianRupee, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function QuickLinks() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      text: "Add New Book",
      path: "/catalog/books/new",
      icon: <Book size={20} />,
    },
    {
      text: "Issue Books",
      path: "/circulation",
      icon: <ArrowRight size={20} />,
    },
    { text: "View Fines", path: "/fines", icon: <IndianRupee size={20} /> },
    { text: "Manage Patrons", path: "/patrons", icon: <Users size={20} /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
      <ul className="space-y-3">
        {quickLinks.map((link, index) => (
          <li key={index}>
            <button
              onClick={() => navigate(link.path)}
              className="flex items-center w-full p-2 text-left text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            >
              <span className="mr-3">{link.icon}</span>
              <span className="font-medium">{link.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuickLinks;
