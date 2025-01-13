import { useQuery } from "@apollo/client";
import React from "react";
import TableSkeleton from "../../../components/TableSkeleton";
import { GET_STUDENTS } from "../../../graphql/queries/studentQuery";

const StudentProfile: React.FC = () => {
  const { loading, error, data } = useQuery(GET_STUDENTS, {
    variables: { limit: 6 }, // Fetch only 6 students
  });

  if (loading) {
    return <TableSkeleton />
  }
  if (error) {
    return <p>Error fetching student profiles: {error.message}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg my-3 shadow-lg">
      <h3 className="text-2xl font-semibold mb-6 text-primary-900">
        Student Profile
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 text-left font-medium">Student</th>
              <th className="py-3 px-4 text-left font-medium">
                Admission Number
              </th>
              <th className="py-3 px-4 text-left font-medium">Class</th>
              <th className="py-3 px-4 text-left font-medium">Section</th>
            </tr>
          </thead>
          <tbody>
            {data.students.map((student: any, index: number) => (
              <tr
                key={student.id}
                className={`transition duration-300 ease-in-out ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="py-4 px-4 border-b whitespace-nowrap">
                  {student.studentName}
                </td>
                <td className="py-4 px-4 border-b whitespace-nowrap">
                  {student.admissionNumber}
                </td>
                <td className="py-4 px-4 border-b whitespace-nowrap">
                  {student.class.className}
                </td>
                <td className="py-4 px-4 border-b whitespace-nowrap">
                  {student.section.sectionName}
                </td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProfile;
