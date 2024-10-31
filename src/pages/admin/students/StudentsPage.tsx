// src/components/StudentsPage.tsx
import React, { useEffect, useState } from "react";
import NewStudentPage from "./AddStudent"; // Import the updated AddStudent
import Axios from "../../../utils/Axios";

const StudentsPage: React.FC = () => {
  const [searchType, setSearchType] = useState("studentName");
  const [searchTerm, setSearchTerm] = useState("");
  const [showStudentForm, setShowStudentForm] = useState(false);

  const [students, setStudents] = useState([]); // Initialize state for students

  // Function to fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await Axios.get("/members?memberType=student");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  // Effect to fetch students when component mounts
  useEffect(() => {
    fetchStudents();
  }, [showStudentForm]);

  const getPlaceholder = () => {
    switch (searchType) {
      case "admissionNumber":
        return "ADMISSION NUMBER";
      default:
        return "STUDENT NAME";
    }
  };

  const filteredStudents = students.filter((student: any) => {
    if (searchType === "studentName") {
      return student.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (searchType === "admissionNumber") {
      return student.admissionNumber.includes(searchTerm);
    }
    return false;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {showStudentForm && (
        <NewStudentPage onClose={() => setShowStudentForm(false)} />
      )}
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-bold text-gray-800 mb-6">Students Page</h4>
        <button
          onClick={() => setShowStudentForm(true)}
          className="bg-primary-800 text-white px-5 py-2 rounded-full hover:bg-primary-600 transition"
        >
          New Student
        </button>
      </div>

      <div className="flex items-center mb-4">
        <select
          className="mr-4 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="studentName">Student Name</option>
          <option value="admissionNumber">Admission Number</option>
        </select>
        <input
          type="text"
          className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-primary-900 text-white text-left">
                Student Name
              </th>
              <th className="py-2 px-4 bg-primary-900 text-white text-left">
                Admission Number
              </th>
              <th className="py-2 px-4 bg-primary-900 text-white text-left">
                Class
              </th>
              <th className="py-2 px-4 bg-primary-900 text-white text-left">
                Section
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student: any) => (
              <tr key={student._id}>
                <td className="py-2 px-4 border-b">{student.studentName}</td>
                <td className="py-2 px-4 border-b">
                  {student.admissionNumber}
                </td>
                <td className="py-2 px-4 border-b">
                  {student?.class?.className}
                </td>
                <td className="py-2 px-4 border-b">
                  {student?.section?.sectionName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;
