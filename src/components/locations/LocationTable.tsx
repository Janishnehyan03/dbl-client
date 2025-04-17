// src/components/locations/LocationTable.tsx
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";

interface Location {
  _id: string;
  name: string;
  description?: string;
  phone: string;
}

interface LocationTableProps {
  locations: Location[];
  loading: boolean;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
}

const LocationTable: React.FC<LocationTableProps> = ({
  locations,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading && locations.length === 0) {
    return (
      <div className="text-gray-600 text-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <p className="text-gray-600 text-center py-4">No locations found.</p>
    );
  }

  return (
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
              Phone
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-600 border-b">
                {location.name}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 border-b">
                {location.description || "-"}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 border-b">
                {location.phone}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 border-b">
                <button
                  onClick={() => onEdit(location)}
                  className="text-indigo-600 hover:text-indigo-800 mr-4"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(location._id)}
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
  );
};

export default LocationTable;
