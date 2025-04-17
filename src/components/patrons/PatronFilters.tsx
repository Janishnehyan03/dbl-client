import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Section } from "../../utils/types";
import {
  getClasses,
  getDivisions,
  getSections,
} from "../../utils/services/classService";
import { getDepartments } from "../../utils/services/departmentService";
import { getRoles } from "../../utils/services/roleService"; // Add this import

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  selectedDivision: string;
  setSelectedDivision: (division: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  selectedRole: string; // New prop
  setSelectedRole: (role: string) => void; // New prop
}

const PatronFilters: React.FC<FiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSection,
  setSelectedSection,
  selectedClass,
  setSelectedClass,
  selectedDivision,
  setSelectedDivision,
  selectedDepartment,
  setSelectedDepartment,
  selectedRole,
  setSelectedRole,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<
    { _id: string; name: string; section: { _id: string } }[]
  >([]);
  const [divisions, setDivisions] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [departments, setDepartments] = useState<
    { _id: string; name: string }[]
  >([]);
  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]); // New state for roles

  const currentSection = sections.find((sec) => sec._id === selectedSection);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [
          sectionsData,
          classesData,
          divisionsData,
          departmentsData,
          rolesData, // Fetch roles
        ] = await Promise.all([
          getSections(),
          getClasses(),
          getDivisions(),
          getDepartments(),
          getRoles(), // Add this to the Promise.all
        ]);

        setSections(sectionsData);
        setClasses(
          classesData.filter((cls) => cls._id !== undefined) as {
            _id: string;
            name: string;
            section: { _id: string };
          }[]
        );
        setDivisions(divisionsData);
        setDepartments(
          departmentsData.filter((dept) => dept._id !== undefined) as {
            _id: string;
            name: string;
          }[]
        );
        setRoles(rolesData); // Set roles state
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    // Reset dependent filters when section changes
    setSelectedClass("");
    setSelectedDivision("");
    setSelectedDepartment("");
  }, [
    selectedSection,
    setSelectedClass,
    setSelectedDivision,
    setSelectedDepartment,
  ]);

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search patron by name, ID or role...`} // Updated placeholder
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>

      {/* Role selector - added above section selector */}
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Roles</option>
        {roles.map((role) => (
          <option key={role._id} value={role._id}>
            {role.name}
          </option>
        ))}
      </select>

      {/* Section selector */}
      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Sections</option>
        {sections.map((section) => (
          <option key={section._id} value={section._id}>
            {section.name}
          </option>
        ))}
      </select>

      {/* Conditional filters */}
      {selectedSection && (
        <div className="flex space-x-4">
          {currentSection?.hasDepartments ? (
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          ) : (
            <>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Classes</option>
                {classes
                  .filter((cls) => cls.section?._id === selectedSection)
                  .map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
              </select>
              {selectedClass && (
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Divisions</option>
                  {divisions.map((div) => (
                    <option key={div._id} value={div._id}>
                      {div.name}
                    </option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PatronFilters;