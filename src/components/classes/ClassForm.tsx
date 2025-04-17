import { useEffect, useState } from "react";
import { getSections } from "../../utils/services/classService";
import { IClass, Section } from "../../utils/types";

interface ClassFormProps {
  initialData?: IClass;
  onSubmit: (data: IClass) => void;
  onCancel: () => void;
}

export const ClassForm = ({
  initialData,
  onSubmit,
  onCancel,
}: ClassFormProps) => {
  const [formData, setFormData] = useState<any>(
    initialData || {
      name: "",
      section: {
        _id: "",
        name: "",
      },
    }
  );
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsData] = await Promise.all([getSections()]);
        setSections(sectionsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading form data...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto"
    >
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-800"
        >
          Class Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          placeholder="Enter class name"
          required
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="section"
          className="block text-sm font-semibold text-gray-800"
        >
          Section
        </label>
        <select
          id="section"
          name="section"
          value={formData.section._id}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 appearance-none transition duration-150 ease-in-out"
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
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 py-2 px-5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};
