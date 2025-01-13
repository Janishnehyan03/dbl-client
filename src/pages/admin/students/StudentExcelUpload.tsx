import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Axios from "../../../utils/Axios";
import toast from "react-hot-toast";

const StudentExcelUpload: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
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
  const [excelData, setExcelData] = useState<any[]>([]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      if (
        selectedFile.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        selectedFile.type !== "application/vnd.ms-excel"
      ) {
        toast.error("Please upload a valid Excel file.");
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Remove header row
        jsonData.shift();

        setExcelData(jsonData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an Excel file to upload.");
      return;
    }

    if (!excelData.length) {
      toast.error("No data found in the Excel file.");
      return;
    }

    Axios.post("/members/upload-student-excel", {
      class: studentClass,
      section: section,
      excelData: excelData,
    })
      .then(() => {
        toast.success("Excel data uploaded successfully!");
        onClose(); // Close the form
      })
      .catch((error) => {
        toast.error("Failed to upload the Excel data.");
        console.error(error);
      });
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="max-w-4xl mx-auto p-10 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-600 mb-8">
          Upload Student Excel
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Excel File
              </label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:border-gray-500"
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
            <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-700 transition duration-200"
            >
              Upload Excel
            </button>
            </div>
        </form>

        {excelData.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              Excel Data Preview
            </h3>
            <div className="overflow-auto max-h-64 border border-gray-300 rounded-md p-4 bg-gray-50">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission Number
                    </th>
                    <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {excelData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row[0]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExcelUpload;
