import { useState, useEffect } from "react";
import { IClass, Section, IDivision } from "../../utils/types";
import {
  getClasses,
  getSections,
  getDivisions,
  createClass,
  updateClass,
  deleteClass,
} from "../../utils/services/classService";
import { ClassTable } from "../../components/classes/ClassTable";
import { Modal } from "../../components/classes/ClassModal";
import { ClassForm } from "../../components/classes/ClassForm";

const ClassManagement = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [divisions, setDivisions] = useState<IDivision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<IClass | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const classesData = await getClasses();
      const sectionsData = await getSections();
      const divisionsData = await getDivisions();
      setClasses(classesData);
      setSections(sectionsData);
      setDivisions(divisionsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to load classes. Please try again.");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setCurrentClass(null);
    setIsModalOpen(true);
    fetchData();
  };

  const handleEdit = (classData: IClass) => {
    setCurrentClass(classData);
    setIsModalOpen(true);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteClass(id);
        setClasses(classes.filter((c) => c._id !== id));
      } catch (err) {
        setError("Failed to delete class");
      }
    }
  };

  const handleSubmit = async (classData: IClass) => {
    try {
      if (currentClass) {
        // Update existing class
        const updatedClass = await updateClass(currentClass._id!, classData);
        setClasses(
          classes.map((c) => (c._id === currentClass._id ? updatedClass : c))
        );
      } else {
        // Create new class
        const newClass = await createClass(classData);
        setClasses([...classes, newClass]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(
        currentClass ? "Failed to update class" : "Failed to create class"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 max-w-7xl mx-auto mt-8">
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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Class Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all academic classes in your institution
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
              Add New Class
            </button>
          </div>

          {classes.length === 0 ? (
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No classes found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new class.
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
                  New Class
                </button>
              </div>
            </div>
          ) : (
            <ClassTable
              classes={classes}
              sections={sections}
              divisions={divisions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={currentClass ? "Edit Class" : "Create New Class"}
          >
            <ClassForm
              initialData={currentClass || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </Modal>
        </>
      </main>
    </div>
  );
};

export default ClassManagement;
