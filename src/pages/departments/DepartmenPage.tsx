import { useState, useEffect } from "react";
import { IDepartment, Section } from "../../utils/types";
import {
  getDepartments,
  getSections,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../utils/services/departmentService";
import { DepartmentTable } from "../../components/departments/DepartmentTable";
import { Modal } from "../../components/classes/ClassModal";
import { DepartmentForm } from "../../components/departments/DepartmentForm";

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] =
    useState<IDepartment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [departmentsData, sectionsData] = await Promise.all([
          getDepartments(),
          getSections(),
        ]);
        setDepartments(departmentsData);
        setSections(sectionsData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setCurrentDepartment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (department: IDepartment) => {
    setCurrentDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(id);
        setDepartments(departments.filter((d) => d._id !== id));
      } catch (err) {
        setError("Failed to delete department");
      }
    }
  };

  const handleSubmit = async (departmentData: IDepartment) => {
    try {
      if (currentDepartment) {
        // Update existing department
        const updatedDepartment = await updateDepartment(
          currentDepartment._id!,
          departmentData
        );
        setDepartments(
          departments.map((d) =>
            d._id === currentDepartment._id ? updatedDepartment : d
          )
        );
      } else {
        // Create new department
        const newDepartment = await createDepartment(departmentData);
        setDepartments([...departments, newDepartment]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(
        currentDepartment
          ? "Failed to update department"
          : "Failed to create department"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">
            Department Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all academic departments in your institution
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Department
        </button>
      </div>

      {departments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No departments
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new department.
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Department
            </button>
          </div>
        </div>
      ) : (
        <DepartmentTable
          departments={departments}
          sections={sections}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDepartment ? "Edit Department" : "Create New Department"}
      >
        <DepartmentForm
          initialData={currentDepartment || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
