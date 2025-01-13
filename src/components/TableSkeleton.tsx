// TableSkeleton.tsx
import React from "react";

const TableSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left font-medium">_</th>
            <th className="py-3 px-4 text-left font-medium">__</th>
            <th className="py-3 px-4 text-left font-medium">_</th>
            <th className="py-3 px-4 text-left font-medium">_</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(6)].map((_, index) => (
            <tr key={index} className="animate-pulse">
              <td className="py-4 px-4 border-b bg-gray-200 rounded-md">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </td>
              <td className="py-4 px-4 border-b bg-gray-200 rounded-md">
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </td>
              <td className="py-4 px-4 border-b bg-gray-200 rounded-md">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </td>
              <td className="py-4 px-4 border-b bg-gray-200 rounded-md">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;