import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import Axios from "../../utils/Axios";
import {
  getClasses,
  getDivisions,
  getSections,
} from "../../utils/services/classService";
import { getDepartments } from "../../utils/services/departmentService";
import { getRoles } from "../../utils/services/roleService";
import {
  IClass,
  IDepartment,
  IDivision,
  Role11,
  Section,
} from "../../utils/types";

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

const PatronExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [classSelection, setClassSelection] = useState("");
  const [division, setDivision] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [options, setOptions] = useState<{
    classes: IClass[];
    departments: IDepartment[];
    sections: Section[];
    divisions: IDivision[];
    roles: Role11[];
  }>({
    classes: [],
    departments: [],
    sections: [],
    divisions: [],
    roles: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [classes, departments, sections, divisions, roles] =
          await Promise.all([
            getClasses(),
            getDepartments(),
            getSections(),
            getDivisions(),
            getRoles(),
          ]);
        setOptions({ classes, departments, sections, divisions, roles });
      } catch (error) {
        console.error("Failed to fetch options:", error);
        toast.error("Failed to load dropdown options");
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setValidationErrors([]);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const errors = validateData(jsonData);
        if (errors.length > 0) {
          setValidationErrors(errors);
          setPreviewData([]);
          return;
        }

        setPreviewData(jsonData);
      } catch (error) {
        toast.error("Error parsing Excel file");
        console.error("Error parsing Excel:", error);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const validateData = (data: any[]): string[] => {
    const errors: string[] = [];
    if (data.length === 0) {
      errors.push("The file is empty");
      return errors;
    }

    const requiredColumns = ["name"];

    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(
      (col) => !Object.keys(firstRow).includes(col)
    );

    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      // Create metadata object with only selected values
      const metadata: Record<string, string> = {};

      if (section) metadata.section = section;
      if (role) metadata.role = role;

      if (selectedSection?.hasDepartments && department) {
        metadata.department = department;
      } else {
        if (classSelection) metadata.class = classSelection;
        if (division) metadata.division = division;
      }

      const payload = {
        data: previewData,
        metadata,
      };

      await Axios.post("/patrons/bulk-insert", payload);

      toast.success(`Patrons imported successfully!`);
      onImportSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Import failed:", error);
      toast.error(
        `Failed to import Patrons: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewData([]);
    setClassSelection("");
    setDivision("");
    setDepartment("");
    setSection("");
    setRole("");
    setValidationErrors([]);
  };

  const selectedSection = options.sections.find((sec) => sec._id === section);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Import Patrons
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-8">
          {/* Pre-import selections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <select
                value={section}
                onChange={(e) => {
                  setSection(e.target.value);
                  setDepartment("");
                  setClassSelection("");
                  setDivision("");
                }}
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Select Section</option>
                {options.sections.map((sec) => (
                  <option key={sec._id} value={sec._id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedSection?.hasDepartments ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="">Select Department</option>
                  {options.departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={classSelection}
                    onChange={(e) => setClassSelection(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Select Class</option>
                    {options.classes
                      .filter((cls) => cls.section?._id === section)
                      .map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Select Division</option>
                    {options.divisions.map((div) => (
                      <option key={div._id} value={div._id}>
                        {div.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="">Select Role</option>
                {options.roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File input */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel File
            </label>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600">
                {file ? file.name : "Drag & drop or click to upload"}
              </span>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className=""
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Supports .xlsx and .xls files
            </p>
          </div>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    {validationErrors.length} Error
                    {validationErrors.length === 1 ? "" : "s"} Found
                  </h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc pl-5">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewData.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Preview
              </h3>
              <div className="max-h-64 overflow-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value, i) => (
                          <td
                            key={i}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                          >
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Showing first 5 of {previewData.length} rows
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !file ||
              !section ||
              !role ||
              (selectedSection?.hasDepartments && !department) ||
              (!selectedSection?.hasDepartments &&
                (!classSelection || !division)) ||
              isLoading
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Importing...
              </>
            ) : (
              "Import"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatronExcelImportModal;
