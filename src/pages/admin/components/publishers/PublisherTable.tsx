import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { IPublisher } from "../../../../utils/types";

interface PublisherTableProps {
  publishers: IPublisher[];
  loading: boolean;
  onEdit: (publisher: IPublisher) => void;
  onDelete: (id: string) => void;
}

const PublisherTable: React.FC<PublisherTableProps> = ({
  publishers,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {loading && !publishers.length ? (
        <p className="text-gray-600 text-center">Loading publishers...</p>
      ) : publishers.length === 0 ? (
        <p className="text-gray-600 text-center">No publishers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Location
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {publishers.map((publisher) => (
                <tr key={publisher._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {publisher.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {publisher.location || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {publisher.email || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {publisher.phone || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    <button
                      onClick={() => onEdit(publisher)}
                      className="text-indigo-600 hover:text-indigo-800 mr-4"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(publisher._id)}
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
  );
};

export default PublisherTable;
