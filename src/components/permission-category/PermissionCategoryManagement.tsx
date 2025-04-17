import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios.ts";
import { Settings } from "lucide-react";
import PermissionCategoriesTable from "./PermissionCategoriesTable";
import PermissionCategoryModal from "./PermissionCategoryModal.tsx";
import { Permission, PermissionCategory } from "../../utils/types.ts";


const PermissionCategoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<PermissionCategory[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]); // Available permissions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<PermissionCategory | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories and permissions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, permissionsRes] = await Promise.all([
          Axios.get(`/permission-categories`),
          Axios.get(`/permissions`),
        ]);
        setCategories(categoriesRes.data);
        setPermissions(permissionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const openModal = (category?: PermissionCategory) => {
    setCurrentCategory(category || null);
    setIsModalOpen(true);
  };

  const handleSave = async (category: PermissionCategory) => {
    setLoading(true);
    try {
      if (category._id) {
        await Axios.put(`/permission-categories/${category._id}`, category);
        setCategories((prev) => prev.map((c) => (c._id === category._id ? category : c)));
      } else {
        const response = await Axios.post(`/permission-categories`, category);
        setCategories((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await Axios.delete(`/permission-categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 text-indigo-600" size={32} />
            Permission Category Management
          </h1>
          <button
            onClick={() => navigate("/admin")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        <PermissionCategoriesTable
          categories={categories}
          loading={loading}
          onEdit={openModal}
          onDelete={handleDelete}
          onAdd={() => openModal()}
        />

        {isModalOpen && (
          <PermissionCategoryModal
            category={currentCategory}
            availablePermissions={permissions}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default PermissionCategoryManagement;