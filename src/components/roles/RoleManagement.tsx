import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import RolesTable from "./RolesTable.tsx";
import RoleModal from "./RoleModal.tsx";
import { Permission, Role11 } from "../../utils/types.ts";
import Axios from "../../utils/Axios.ts";

const RoleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role11[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]); // Available permissions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role11 | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch roles and permissions (mocked for demo)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rolesRes, permissionsRes] = await Promise.all([
          Axios.get("/roles"),
          Axios.get("/permissions"),
        ]);

        setRoles(rolesRes.data);
        setPermissions(permissionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const openModal = (role?: Role11) => {
    setCurrentRole(role || null);
    setIsModalOpen(true);
  };

  const handleSave = async (role: Role11) => {
    setLoading(true);
    try {
      if (role._id) {
        // Update existing role (PUT)
        await Axios.put(`/roles/${role._id}`, role);
        setRoles((prev) => prev.map((r) => (r._id === role._id ? role : r)));
      } else {
        // Create new role (POST)
        const { data } = await Axios.post("/roles", role);
        setRoles((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error("Error saving role:", error);
    }
    setIsModalOpen(false);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await Axios.delete(`/roles/${id}`);
      setRoles((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 text-indigo-600" size={32} />
            Role Management
          </h1>
          <button
            onClick={() => navigate("/admin")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        <RolesTable
          roles={roles}
          loading={loading}
          onEdit={openModal}
          onDelete={handleDelete}
          onAdd={() => openModal()}
        />

        {isModalOpen && (
          <RoleModal
            role={currentRole}
            availablePermissions={permissions}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
