import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../../../utils/Axios";
import { Author } from "../../../utils/types";
import AuthorPopup from "../books/components/AuthorPopup";

function AuthorsPage() {
  const [showForm, setShowForm] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [sortOption, setSortOption] = useState("a-z");
  const [isEditing, setIsEditing] = useState(false);
  const [authorId, setAuthorId] = useState<any>("");
  const [searchTerm, setSearchTerm] = useState("");

  const getAuthors = async () => {
    try {
      let { data } = await Axios.get("/authors");
      setAuthors(data);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const sortPublishers = (authors: Author[], option: string) => {
    switch (option) {
      case "a-z":
        return authors.sort((a, b) =>
          (a.firstName || "").localeCompare(b.firstName || "")
        );
      case "z-a":
        return authors.sort((a, b) =>
          (b.firstName || "").localeCompare(a.firstName || "")
        );
      default:
        return authors;
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const filteredAuthors = authors.filter((author) => {
    const fullName = `${author.firstName} ${author.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    getAuthors();
  }, [showForm, isEditing]);

  return (
    <div className="bg-gray-50 p-5 rounded-lg shadow-lg">
      <h1 className="bg-gray-800 p-4 text-center text-white font-semibold rounded-t-lg">
        Authors
      </h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-gray-700 hover:bg-gray-800 transition-colors text-white p-3 rounded-md mt-3 ml-auto flex items-center space-x-2"
      >
        <Plus className="mr-1" />
        <span>New Author</span>
      </button>

      {(showForm || isEditing) && (
        <AuthorPopup
          authorId={authorId}
          isEditing={isEditing}
          setShowAuthor={setShowForm}
          setIsEditing={setIsEditing}
        />
      )}

      {/* Search Bar */}
      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder="Search authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="overflow-x-auto mt-4">
        <div className="flex items-center p-2 bg-gray-200 max-w-sm rounded-md space-x-3 mb-4">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-md text-gray-700 p-1"
          >
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>
        <table className="min-w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <thead className="bg-gray-800 text-white text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Website</th>
              <th className="py-3 px-6 text-left">Edit</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {sortPublishers(filteredAuthors, sortOption).map((author) => (
              <tr
                key={author._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {author.firstName} {author.lastName}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {author.email}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {author.contactNumber}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <a href={author.website} className="text-blue-700">
                    {author.website}
                  </a>
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <button
                    onClick={() => {
                      setAuthorId(author._id);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuthorsPage;
