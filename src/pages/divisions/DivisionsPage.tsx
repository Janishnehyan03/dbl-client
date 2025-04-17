import { useState, useEffect } from "react";
import { IDivision } from "../../utils/types";
import {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
} from "../../utils/services/divisionService";
import { DivisionTable } from "../../components/divisions/DivisionTable";
import { Modal } from "../../components/classes/ClassModal";
import { DivisionForm } from "../../components/divisions/DivisionForm";

export const DivisionsPage = () => {
  const [divisions, setDivisions] = useState<IDivision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<IDivision | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const divisionsData = await getDivisions();
        setDivisions(divisionsData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch divisions");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setCurrentDivision(null);
    setIsModalOpen(true);
  };

  const handleEdit = (division: IDivision) => {
    setCurrentDivision(division);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this division?")) {
      try {
        await deleteDivision(id);
        setDivisions(divisions.filter((d) => d._id !== id));
      } catch (err) {
        setError("Failed to delete division");
      }
    }
  };

  const handleSubmit = async (divisionData: IDivision) => {
    try {
      if (currentDivision) {
        // Update existing division
        const updatedDivision = await updateDivision(
          currentDivision._id!,
          divisionData
        );
        setDivisions(
          divisions.map((d) =>
            d._id === currentDivision._id ? updatedDivision : d
          )
        );
      } else {
        // Create new division
        const newDivision = await createDivision(divisionData);
        setDivisions([...divisions, newDivision]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(
        currentDivision
          ? "Failed to update division"
          : "Failed to create division"
      );
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading divisions...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6  py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">
          Division Management
        </h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Division
        </button>
      </div>

      {divisions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No divisions found. Create one to get started.
          </p>
        </div>
      ) : (
        <DivisionTable
          divisions={divisions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDivision ? "Edit Division" : "Create New Division"}
      >
        <DivisionForm
          initialData={currentDivision || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
