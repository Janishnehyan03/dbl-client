import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GET_STUDENTS } from "../../../graphql/queries/studentQuery";
import { GET_TEACHERS } from "../../../graphql/queries/teacherQuery"; // Import the new teacher query
import AddMember from "./AddMember";
import StudentExcelUpload from "./StudentExcelUpload";

const MembersPage: React.FC = () => {
  const [searchType, setSearchType] = useState("studentName");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMember, setShowMember] = useState(false);
  const [limit, setLimit] = useState(5);
  const [memberRole, setMemberRole] = useState("student"); // Track selected member role
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
  };

  const { data, loading, error, refetch } = useQuery(
    memberRole === "student" ? GET_STUDENTS : GET_TEACHERS,
    {
      variables: { limit, searchTerm },
    }
  );

  const getPlaceholder = () => {
    if (memberRole === "student") {
      return searchType === "admissionNumber"
        ? "ADMISSION NUMBER"
        : "STUDENT NAME";
    } else {
      return searchType === "uniqueId" ? "UNIQUE ID" : "TEACHER NAME"; // Updated for teacher context
    }
  };

  const handleSearch = () => {
    refetch({ limit, searchTerm });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {showMember && <AddMember onClose={() => setShowMember(false)} />}
      <div className="flex items-center justify-between">
        <h4 className="text-3xl font-bold text-gray-800 mb-6">Members Page</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowMember(true)}
            className="bg-primary-800 text-white px-5 py-2 rounded-full hover:bg-primary-600 transition"
          >
            New Member
          </button>
          <button
            className="bg-primary-800 text-white px-5 py-2 rounded-full hover:bg-primary-600 transition"
            onClick={handleUploadClick}
          >
            Upload Excel
          </button>

          {showUploadModal && <StudentExcelUpload onClose={handleCloseModal} />}
        </div>
      </div>

      <div className="flex items-center mb-4">
        <select
          className="mr-4 py-2 px-1 rounded  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={memberRole}
          onChange={(e) => {
            setMemberRole(e.target.value);
            setSearchTerm(""); // Reset search when changing role
            setSearchType(
              e.target.value === "teacher" ? "uniqueId" : "studentName"
            ); // Set default search type based on role
          }}
        >
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
        </select>
        <select
          className="mr-4 py-2 px-1  rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={40}>40</option>
        </select>

        <input
          type="text"
          className="w-full py-2 px-3 rounded  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : error ? (
        <p>Error loading members</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {memberRole === "student" ? (
                  <>
                    <th className="py-2 px-4 bg-primary-900 text-white text-left">
                      #
                    </th>
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
                  </>
                ) : (
                  <>
                    <th className="py-2 px-4 bg-primary-900 text-white text-left">
                      #
                    </th>
                    <th className="py-2 px-4 bg-primary-900 text-white text-left">
                      Teacher Name
                    </th>
                    <th className="py-2 px-4 bg-primary-900 text-white text-left">
                      Unique ID
                    </th>
                    <th className="py-2 px-4 bg-primary-900 text-white text-left">
                      Section
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data?.[memberRole + "s"]?.map((member: any, index: number) => (
                <tr key={member.id}>
                  {memberRole === "student" ? (
                    <>
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">
                        {member.studentName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {member.admissionNumber}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {member.class?.className}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {member.section?.sectionName}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">
                        {member.teacherName}
                      </td>
                      <td className="py-2 px-4 border-b">{member.uniqueId}</td>
                      <td className="py-2 px-4 border-b">
                        {member.section.sectionName}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
