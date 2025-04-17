import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Permission } from "../../utils/types";

interface PermissionModalProps {
  permission: Permission | null;
  onClose: () => void;
  onSave: (permission: Permission) => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  permission,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Permission>(
    permission || { _id: "", name: "", description: "" }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        if (!formData.name.trim())
          throw new Error("Permission name is required.");
        if (!formData.description.trim())
          throw new Error("Description is required.");
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
          {permission ? "Edit Permission" : "Add Permission"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permission Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., create_user"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Allows user creation"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
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

export default PermissionModal;
