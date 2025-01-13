import React, { useState, useEffect } from "react";
import Axios from "../../../utils/Axios";
import toast from "react-hot-toast";

const AddMember: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [memberName, setMemberName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [uniqueId, setUniqueId] = useState(""); // New state for unique ID
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("");
  const [memberType, setMemberType] = useState("student"); // Added state for member type
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
        memberType,
        ...(memberType === "student"
          ? { admissionNumber, class: studentClass, section, studentName: memberName } // For students
          : { uniqueId, section, teacherName: memberName } // For teachers
        ),
      });
      toast.success(`${memberType.charAt(0).toUpperCase() + memberType.slice(1)} added successfully!`);
      onClose(); // Call onClose to hide the form after successful submission
      resetForm(); // Reset the form fields
    } catch (error) {
      toast.error(`Failed to add ${memberType}.`);
    }
  };

  const resetForm = () => {
    setMemberName("");
    setAdmissionNumber("");
    setUniqueId(""); // Reset unique ID
    setStudentClass("");
    setSection("");
    setMemberType("student"); // Reset member type
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
          Register New Member
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Member Name
              </label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:border-gray-500"
                placeholder="Enter member's full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Member Type
              </label>
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:border-gray-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {memberType === "student" ? "Admission Number" : "Unique ID"}
              </label>
              <input
                type="text"
                value={memberType === "student" ? admissionNumber : uniqueId}
                onChange={(e) =>
                  memberType === "student"
                    ? setAdmissionNumber(e.target.value)
                    : setUniqueId(e.target.value)
                }
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:border-gray-500"
                placeholder={memberType === "student" ? "Enter admission number" : "Enter unique ID"}
                required
              />
            </div>
           
            {memberType === "student" && (
              <>
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
              </>
            )}
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
            Register {memberType.charAt(0).toUpperCase() + memberType.slice(1)}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-red-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddMember;
