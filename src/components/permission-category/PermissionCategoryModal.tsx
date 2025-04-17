import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Permission, PermissionCategory } from "../../utils/types";

interface PermissionCategoryModalProps {
  category: PermissionCategory | null;
  availablePermissions: Permission[];
  onClose: () => void;
  onSave: (category: PermissionCategory) => void;
}

const PermissionCategoryModal: React.FC<PermissionCategoryModalProps> = ({
  category,
  availablePermissions,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<PermissionCategory>(
    category || { _id: "", name: "", permissions: [] }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePermissionToggle = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        if (!formData.name.trim())
          throw new Error("Category name is required.");
        onSave(formData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
        setLoading(false);
      }
    }, 1000); // Simulated delay
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Lock className="mr-2 text-indigo-600" size={20} />
          {category ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., User Management"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
              {availablePermissions.map((permission) => (
                <div key={permission._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission._id)}
                    onChange={() => handlePermissionToggle(permission._id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    {permission.name} - {permission.description}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionCategoryModal;
