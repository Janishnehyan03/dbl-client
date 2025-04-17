import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Plus, Edit, Trash2 } from "lucide-react";
import Axios from "../../utils/Axios";
import {
  ICategory,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../utils/types";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AddCategoryModal from "../../components/categories/AddCategoryModal.tsx";
import EditCategoryModal from "../../components/categories/EditCategoryModal.tsx";

const API_URL = "/categories";

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(API_URL);
        setCategories(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch categories. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setError(null);
  };

  const openEditModal = (category: ICategory) => {
    setCurrentCategory(category);
    setIsEditModalOpen(true);
    setError(null);
  };

  const handleAddSubmit = async (formData: CreateCategoryDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios.post(API_URL, formData);
      setCategories([...categories, response.data]);
      setSuccess(true);
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to add category. Please try again."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleEditSubmit = async (formData: UpdateCategoryDto) => {
    if (!currentCategory) return;

    try {
      setLoading(true);
      setError(null);
      const response = await Axios.patch(
        `${API_URL}/${currentCategory._id}`,
        formData
      );
      setCategories(
        categories.map((cat) =>
          cat._id === currentCategory._id ? response.data : cat
        )
      );
      setSuccess(true);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update category. Please try again."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setLoading(true);
        setError(null);
        await Axios.delete(`${API_URL}/${id}`);
        setCategories(categories.filter((cat) => cat._id !== id));
        setSuccess(true);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to delete category. Please try again."
        );
      } finally {
        setLoading(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Tag className="mr-3 text-indigo-600" size={32} />
            Categories
          </h1>
          <div className="space-x-4">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <Plus className="mr-2" size={20} />
              Add Category
            </button>
            <button
              onClick={() => navigate("/catalog/books")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to Books
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && <LoadingSpinner className="mb-4" />}

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {categories.length === 0 && !loading ? (
            <p className="text-gray-600 text-center">No categories found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {category.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {category.description}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-indigo-600 hover:text-indigo-800 mr-4"
                          disabled={loading}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          loading={loading}
        />

        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={currentCategory}
          onSubmit={handleEditSubmit}
          loading={loading}
        />

        {/* Feedback Messages */}
        {success && (
          <FeedbackMessage
            type="success"
            message="Action completed successfully!"
            className="mt-4"
          />
        )}
        {error && (
          <FeedbackMessage type="error" message={error} className="mt-4" />
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
