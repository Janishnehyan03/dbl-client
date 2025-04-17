import { Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import { Permission } from "../../utils/types";
import PermissionModal from "./PermissionModal";
import PermissionsTable from "./PermissionTable";

const API_URL = "/permissions"; // Adjust based on your backend URL

const PermissionManagement: React.FC = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(API_URL);
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const openModal = (permission?: Permission) => {
    setCurrentPermission(permission || null);
    setIsModalOpen(true);
  };

  const handleSave = async (permission: Permission) => {
    try {
      setLoading(true);
      if (permission._id) {
        await Axios.put(`${API_URL}/${permission._id}`, permission);
        setPermissions((prev) =>
          prev.map((p) => (p._id === permission._id ? permission : p))
        );
      } else {
        const response = await Axios.post(API_URL, permission);
        setPermissions((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("Error saving permission:", error);
    } finally {
      setIsModalOpen(false);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await Axios.delete(`${API_URL}/${id}`);
      setPermissions((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting permission:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 text-indigo-600" size={32} />
            Permission Management
          </h1>
          <button
            onClick={() => navigate("/admin")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        <PermissionsTable
          permissions={permissions}
          loading={loading}
          onEdit={openModal}
          onDelete={handleDelete}
          onAdd={() => openModal()}
        />

        {isModalOpen && (
          <PermissionModal
            permission={currentPermission}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default PermissionManagement;
