import React from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../../utils/types";
import ErrorMessage from "../ui/ErrorMessage";
import LoadingSpinner from "../ui/LoadingSpinner";

interface PatronsTableProps {
  searchQuery: string;
  selectedSection: string;
  selectedClass: string;
  selectedDivision: string;
  selectedDepartment: string;
  selectedRole: string; // Add selectedRole prop
  patrons: Student[];
  loading: boolean;
  error: string | null;
}

const PatronsTable: React.FC<PatronsTableProps> = ({
  searchQuery,
  selectedSection,
  selectedClass,
  selectedDivision,
  selectedDepartment,
  selectedRole, // Add selectedRole prop
  patrons,
  loading,
  error,
}) => {
  // Filter patrons based on the provided filters
  const filteredPatrons = patrons.filter((patron) => {
    const matchesSearchQuery =
      patron.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patron.admissionNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSection = selectedSection
      ? patron.section?._id === selectedSection
      : true;

    const matchesClass = selectedClass
      ? patron.class?._id === selectedClass
      : true;

    const matchesDivision = selectedDivision
      ? patron.division?._id === selectedDivision
      : true;

    const matchesDepartment = selectedDepartment
      ? patron.department?._id === selectedDepartment
      : true;

    const matchesRole = selectedRole ? patron.role?._id === selectedRole : true;

    return (
      matchesSearchQuery &&
      matchesSection &&
      matchesClass &&
      matchesDivision &&
      matchesDepartment &&
      matchesRole
    );
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      {filteredPatrons.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">No patron found.</p>
        </div>
      )}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Admission Number
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Class
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Division
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Section
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredPatrons.map((patron, index) => (
            <tr
              key={patron._id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/patrons/${patron._id}`)}
            >
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {index + 1}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {patron.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="text-sm leading-5 text-gray-900">
                  {patron.admissionNumber || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="text-sm leading-5 text-gray-900">
                  {patron.class?.name || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="text-sm leading-5 text-gray-900">
                  {patron.division?.name || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="text-sm leading-5 text-gray-900">
                  {patron.department?.name || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div className="text-sm leading-5 text-gray-900">
                  {patron.section?.name || "-"}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatronsTable;
