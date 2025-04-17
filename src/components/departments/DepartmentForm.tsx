import { useState, useEffect } from "react";
import { IDepartment, Section } from "../../utils/types";
import { getSections } from "../../utils/services/classService";

interface DepartmentFormProps {
  initialData?: IDepartment;
  onSubmit: (data: IDepartment) => void;
  onCancel: () => void;
}

export const DepartmentForm = ({
  initialData,
  onSubmit,
  onCancel,
}: DepartmentFormProps) => {
  const [formData, setFormData] = useState<IDepartment>({
    name: initialData?.name ?? "",
    section: initialData?.section ?? {
      _id: "",
      name: "",
      hasDepartments: false,
    },
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsData = await getSections();
        setSections(sectionsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching sections:", error);
        setError("Failed to load sections. Please try again.");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.section) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    onSubmit(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600 text-sm">Loading form data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-800"
            >
              Department Name
              <span className="ml-1 text-red-500">*</span>
            </label>
            {formData.name.length > 0 && (
              <span className="text-xs text-gray-500">
                {formData.name.length}/50
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition duration-200 ease-in-out"
              placeholder="e.g., Computer Science"
              maxLength={50}
              required
            />
            {formData.name && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="section"
            className="block text-sm font-semibold text-gray-800"
          >
            Section
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="section"
              name="section"
              value={formData.section._id}
              onChange={handleChange}
              className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition duration-200 ease-in-out"
              required
            >
              <option value="" disabled>
                Select a section
              </option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 8l4 4 4-4"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border border-gray-200 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out"
          >
            <svg
              className="mr-1 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formData.name || !formData.section}
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {initialData ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              )}
            </svg>
            {initialData ? "Update" : "Create"} Department
          </button>
        </div>
      </form>
    </div>
  );
};
