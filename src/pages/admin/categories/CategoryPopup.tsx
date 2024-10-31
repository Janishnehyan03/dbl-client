import { useState, useEffect } from "react";
import Axios from "../../../utils/Axios";
import toast from "react-hot-toast";
import { ICategory } from "../../../utils/types";

interface CategoryPopUpProps {
  setShowCategory: (show: boolean) => void;
  isEditing?: boolean;
  categoryId?: string;
  setIsEditing: (isEditing: boolean) => void;
}

const CategoryPopUp: React.FC<CategoryPopUpProps> = ({
  setShowCategory,
  isEditing = false,
  categoryId,
  setIsEditing,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ICategory>({
    // _id: "",
    categoryName: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Fetch category details if editing
  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditing && categoryId) {
        setLoading(true);
        try {
          const res = await Axios.get(`/categories/${categoryId}`);
          if (res.status === 200) {
            setFormData(res.data);
          }
        } catch (error) {
          toast.error("Failed to fetch category details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCategory();
  }, [isEditing, categoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = isEditing
        ? await Axios.patch(`/categories/${categoryId}`, formData)
        : await Axios.post("/categories", formData);

      if (res.status === (isEditing ? 200 : 201)) {
        toast.success(isEditing ? "Category Updated" : "Category Created");
        setShowCategory(false);
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Category" : "Create New Category"}
            </h3>
            <button
              type="button"
              onClick={() => setShowCategory(false)}
              className="text-gray-400 hover:text-gray-900 rounded-lg p-1"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <form onSubmit={saveCategory}>
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  placeholder="Enter category name"
                  value={formData.categoryName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setShowCategory(false);
                  }}
                  className="text-gray-700 bg-white border border-gray-300 rounded-md px-4 py-2 mr-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.categoryName.trim().length === 0}
                  className={`text-white ${
                    loading
                      ? "bg-primary-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  } focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5`}
                >
                  {loading ? "Processing..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPopUp;
