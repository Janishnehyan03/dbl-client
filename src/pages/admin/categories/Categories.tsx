import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Axios from "../../../utils/Axios";
import { ICategory } from "../../../utils/types";
import CategoryPopup from "./CategoryPopup";

function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [sortOption, setSortOption] = useState("a-z");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");

  const getCategories = async () => {
    try {
      const { data } = await Axios.get("/categories");
      setCategories(data);
      setFilteredCategories(data); // Initialize filtered categories
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const sortCategories = (categories: ICategory[], option: string) => {
    return [...categories].sort((a, b) => {
      switch (option) {
        case "a-z":
          return (a.categoryName || "").localeCompare(b.categoryName || "");
        case "z-a":
          return (b.categoryName || "").localeCompare(a.categoryName || "");
        default:
          return 0;
      }
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter categories based on the search term
    const filtered = categories.filter(category =>
      category.categoryName.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
  };

  useEffect(() => {
    getCategories();
  }, [showForm, isEditing]);

  return (
    <div className="bg-teal-50 p-6 rounded-lg shadow-lg min-h-screen">
      <h1 className="bg-teal-700 p-4 text-center text-white font-semibold rounded-t-lg">
        Categories
      </h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-teal-600 hover:bg-teal-700 transition-colors text-white p-3 rounded-md mt-3 ml-auto flex items-center space-x-2"
      >
        <Plus className="mr-1" />
        <span>New Category</span>
      </button>

      {(showForm || isEditing) && (
        <CategoryPopup
          categoryId={categoryId}
          isEditing={isEditing}
          setShowCategory={setShowForm}
          setIsEditing={setIsEditing}
        />
      )}

      <div className="overflow-x-auto mt-4">
        <div className="flex items-center p-2 bg-teal-200 rounded-md space-x-3 mb-4">
          <label htmlFor="sort" className="text-sm font-medium text-teal-700">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="border border-teal-300 rounded-md text-teal-700 p-1"
          >
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search categories..."
            className="border border-teal-300 rounded-md text-teal-700 p-2 w-full"
          />
        </div>

        <table className="min-w-full bg-white rounded-md shadow-sm border border-teal-200 overflow-hidden">
          <thead className="bg-teal-700 text-white text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Category Name</th>
              <th className="py-3 px-6 text-left">Edit</th>
            </tr>
          </thead>
          <tbody className="text-teal-700 text-sm">
            {sortCategories(filteredCategories, sortOption).map((category) => (
              <tr
                key={category._id}
                className="border-b border-teal-200 hover:bg-teal-100 transition"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {category.categoryName}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <button
                    onClick={() => {
                      setCategoryId(category._id || "");
                      setIsEditing(true);
                      setShowForm(true); // Open the form for editing
                    }}
                    className="text-teal-600 underline hover:text-teal-800 transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCategories.length === 0 && (
          <p className="text-center mt-5 text-gray-600">No categories found.</p>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;
