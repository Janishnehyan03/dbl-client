import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { IAuthor } from "../../../../utils/types";

interface AuthorsTableProps {
  authors: IAuthor[];
  loading: boolean;
  onEdit: (author: IAuthor) => void;
  onDelete: (id: string) => void;
}

const AuthorsTable: React.FC<AuthorsTableProps> = ({
  authors,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {authors.length === 0 && !loading ? (
        <p className="text-gray-600 text-center">No authors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Nationality
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {author.name}
                  </td>
             
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    {author.email}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 border-b">
                    <button
                      onClick={() => onEdit(author)}
                      className="text-indigo-600 hover:text-indigo-800 mr-4"
                      disabled={loading}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => author._id && onDelete(author._id)}
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

export default AuthorsTable;
