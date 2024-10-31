import React, { useState, useEffect } from "react";
import Axios from "../../../utils/Axios";

const AddStudent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [studentName, setStudentName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [classOptions, setClassOptions] = useState<
    { _id: string; className: string }[]
  >([]);
  const [sectionOptions, setSectionOptions] = useState<
    { _id: string; sectionName: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const classRes = await Axios.get("/classes");
        const sectionRes = await Axios.get("/sections");
        setClassOptions(classRes.data);
        setSectionOptions(sectionRes.data);
      } catch (err) {
        setError("Failed to load options");
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Axios.post("/members", {
        memberType: "student",
        studentName,
        admissionNumber,
        class: studentClass,
        section,
      });
      alert("Student added successfully!");
      onClose(); // Call onClose to hide the form after successful submission
      setStudentName("");
      setAdmissionNumber("");
      setStudentClass("");
      setSection("");
    } catch (error) {
      alert("Failed to add student.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="max-w-lg mx-auto p-10 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-600 mb-8">
          Register New Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:border-gray-500"
                placeholder="Enter student's full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admission Number
              </label>
              <input
                type="text"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:border-gray-500"
                placeholder="Enter admission number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class
              </label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:border-gray-500"
                required
              >
                <option value="" disabled>
                  Select Class
                </option>
                {classOptions.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:border-gray-500"
                required
              >
                <option value="" disabled>
                  Select Section
                </option>
                {sectionOptions.map((sec) => (
                  <option key={sec._id} value={sec._id}>
                    {sec.sectionName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition duration-200"
          >
            Register Student
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-red-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddStudent;
