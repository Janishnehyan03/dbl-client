import React from "react";
import { Edit, Trash, Plus } from "lucide-react";
import { PermissionCategory } from "../../utils/types";

interface PermissionCategoriesTableProps {
  categories: PermissionCategory[];
  loading: boolean;
  onEdit: (category: PermissionCategory) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const PermissionCategoriesTable: React.FC<PermissionCategoriesTableProps> = ({
  categories,
  loading,
  onEdit,
  onDelete,
  onAdd,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Permission Categories</h2>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Add Category
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-600 text-center">No categories defined.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Permissions
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
                    {category.permissions.length} permission(s)
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b flex space-x-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(category._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PermissionCategoriesTable;