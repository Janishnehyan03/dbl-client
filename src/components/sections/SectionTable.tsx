import { Edit, Trash2 } from "lucide-react";
import { Section } from "../../utils/types";

interface SectionTableProps {
  sections: Section[];
  loading: boolean;
  onEdit: (section: Section) => void;
  onDelete: (id: string) => void;
}

export const SectionTable: React.FC<SectionTableProps> = ({
  sections,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {loading && sections.length === 0 ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : sections.length === 0 ? (
        <p className="text-gray-600 text-center">No sections found.</p>
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
                  Has Departments
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {section.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {section.description}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {section.hasDepartments ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    <button
                      onClick={() => onEdit(section)}
                      className="text-indigo-600 hover:text-indigo-800 mr-4"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(section._id)}
                      className="text-red-600 hover:text-red-800"
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
  );
};
