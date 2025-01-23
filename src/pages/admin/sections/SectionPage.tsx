import { useEffect, useState } from "react";
import Axios from "../../../utils/Axios"; // Adjust the import path as needed

const ClassAndSection = () => {
  // State management for sections
  const [sections, setSections] = useState<{ _id: string; sectionName: string }[]>([]);
  const [sectionName, setSectionName] = useState<string>("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // State management for classes
  const [classes, setClasses] = useState<{ _id: string; className: string }[]>([]);
  const [className, setClassName] = useState<string>("");
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  // Fetch Sections
  const fetchSections = async () => {
    try {
      const { data } = await Axios.get("/sections");
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  // Fetch Classes
  const fetchClasses = async () => {
    try {
      const { data } = await Axios.get("/classes");
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // Create or Update Section
  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSectionId) {
        await Axios.put(`/sections/${editingSectionId}`, { sectionName });
      } else {
        await Axios.post("/sections", { sectionName });
      }
      setSectionName("");
      setEditingSectionId(null);
      fetchSections();
    } catch (error) {
      console.error("Error saving section:", error);
    }
  };

  // Create or Update Class
  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClassId) {
        await Axios.put(`/classes/${editingClassId}`, { className });
      } else {
        await Axios.post("/classes", { className });
      }
      setClassName("");
      setEditingClassId(null);
      fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  // Edit Section
  const editSection = (section: { _id: string; sectionName: string }) => {
    setSectionName(section.sectionName);
    setEditingSectionId(section._id);
  };

  // Edit Class
  const editClass = (classItem: { _id: string; className: string }) => {
    setClassName(classItem.className);
    setEditingClassId(classItem._id);
  };

  // Delete Section
  const deleteSection = async (id: string) => {
    try {
      await Axios.delete(`/sections/${id}`);
      fetchSections();
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  // Delete Class
  const deleteClass = async (id: string) => {
    try {
      await Axios.delete(`/classes/${id}`);
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchClasses();
  }, []);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg min-h-screen flex flex-wrap justify-between">
  {/* Sections Section */}
  <div className="w-full md:w-1/2 pr-4 mb-6 md:mb-0">
    <h2 className="text-gray-700 text-2xl font-semibold mb-4">Sections</h2>
    <form onSubmit={handleSectionSubmit} className="mb-4">
      <input
        type="text"
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
        placeholder="Section Name"
        required
        className="border border-gray-300 p-3 rounded-md w-full mb-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <button
        type="submit"
        className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        {editingSectionId ? "Update Section" : "Add Section"}
      </button>
    </form>

    <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
      <thead className="bg-gray-700 text-white text-sm">
        <tr>
          <th className="py-3 px-6 text-left">Section Name</th>
          <th className="py-3 px-6 text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700 text-sm">
        {sections.map((section) => (
          <tr
            key={section._id}
            className="border-b border-gray-200 hover:bg-gray-100 transition duration-150"
          >
            <td className="py-3 px-6">{section.sectionName}</td>
            <td className="py-3 px-6 flex space-x-4">
              <button
                onClick={() => editSection(section)}
                className="text-gray-600 hover:text-gray-800 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSection(section._id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Classes Section */}
  <div className="w-full md:w-1/2 pl-4">
    <h2 className="text-gray-700 text-2xl font-semibold mb-4">Classes</h2>
    <form onSubmit={handleClassSubmit} className="mb-4">
      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="Class Name"
        required
        className="border border-gray-300 p-3 rounded-md w-full mb-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <button
        type="submit"
        className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        {editingClassId ? "Update Class" : "Add Class"}
      </button>
    </form>

    <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <thead className="bg-gray-700 text-white text-sm">
        <tr>
          <th className="py-3 px-6 text-left">Class Name</th>
          <th className="py-3 px-6 text-left">Actions</th>
        </tr>
      </thead>
      <tbody className="text-gray-700 text-sm">
        {classes.map((classItem) => (
          <tr
            key={classItem._id}
            className="border-b border-gray-200 hover:bg-gray-100 transition duration-150"
          >
            <td className="py-3 px-6">{classItem.className}</td>
            <td className="py-3 px-6 flex space-x-4">
              <button
                onClick={() => editClass(classItem)}
                className="text-gray-600 hover:text-gray-800 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteClass(classItem._id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default ClassAndSection;
