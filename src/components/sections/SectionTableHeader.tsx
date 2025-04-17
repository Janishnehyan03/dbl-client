import React from "react";
import { Layers, Plus } from "lucide-react";

interface TableHeaderProps {
  onAddClick: () => void;
  onBackClick: () => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  onAddClick,
  onBackClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center">
        <Layers className="mr-3 text-indigo-600" size={32} />
        Sections
      </h1>
      <div className="space-x-4">
        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Add Section
        </button>
        <button
          onClick={onBackClick}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Back to Books
        </button>
      </div>
    </div>
  );
};
