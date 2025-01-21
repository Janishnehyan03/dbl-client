import { useQuery } from "@apollo/client";
import React from "react";
import TableSkeleton from "../../../components/TableSkeleton";
import { GET_STUDENTS } from "../../../graphql/queries/studentQuery";
import GrayTable from "../../../components/GrayTable";
import { useNavigate } from "react-router-dom";

const StudentProfile: React.FC = () => {
  const { loading, error, data } = useQuery(GET_STUDENTS, {
    variables: { limit: 6 }, // Fetch only 6 students
  });

  const navigate = useNavigate();

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <p>Error fetching student profiles: {error.message}</p>;
  }

  const headers = ["#", "Student", "Admission Number", "Class", "Section"];
  const rows = data.students.map((student: any, index: any) => ({
    "#": index + 1,
    Student: <span className="text-blue-600"> {student.studentName}</span>,
    "Admission Number": student.admissionNumber,
    Class: student.class.className,
    Section: student.section.sectionName,
  }));

  return (
    <div className="bg-white p-6 rounded-lg my-3 shadow-lg">
      <h3 className="text-2xl font-semibold mb-6 text-primary-900">
        Student Profile
      </h3>
      <GrayTable
        headers={headers}
        rows={rows}
        onRowClick={(_: any, index) =>
          navigate(`/profile/${data.students[index].id}`)
        }
      />
    </div>
  );
};

export default StudentProfile;
