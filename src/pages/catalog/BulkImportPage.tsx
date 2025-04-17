import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";

const BulkImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      previewFile(selectedFile);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text
        .split("\n")
        .map((row) => row.split(",").map((cell) => cell.trim()));
      const headers = rows[0];
      const data = rows.slice(1).map((row) =>
        headers.reduce((obj, header, index) => {
          obj[header] = row[index] || "";
          return obj;
        }, {} as any)
      );
      setPreviewData(data);
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Simulate backend processing
    setTimeout(() => {
      try {
        // Basic validation
        if (previewData.length === 0) {
          throw new Error("No valid data found in the uploaded file.");
        }

        previewData.forEach((book, index) => {
          if (!book.title || !book.author || !book.accNumber) {
            throw new Error(
              `Row ${
                index + 1
              }: Missing required fields (title, author, or accession number).`
            );
          }
        });

        // Log the imported books (replace with actual API call)
        console.log("Bulk Imported Books:", previewData);

        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          setSuccess(false);
          setFile(null);
          setPreviewData([]);
          navigate("/catalog/books"); // Redirect to books list after success
        }, 2000);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during import."
        );
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 text-indigo-600" size={32} />
            Bulk Import Books
          </h1>
          <button
            onClick={() => navigate("/catalog/books")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Books
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Instructions
          </h2>
          <p className="text-gray-600">
            Upload an excel file with the following columns:{" "}
            <strong>
              title, accNumber,callNumber, pages, edition, issn, isbn, price
            </strong>
            . Required fields are <strong>title, accNumber,callNumber</strong>.
          </p>
          <p className="text-gray-600 mt-2">
            Example:{" "}
            <code>
              "Book Title", "ACC01", "CAL/002", "143", "1st", "ISSN00038","ISBN002","1200"
            </code>
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer hover:bg-indigo-200 transition-all duration-200 flex items-center"
                >
                  <Upload className="mr-2" size={20} />
                  Choose File
                </label>
                <span className="text-gray-600">
                  {file ? file.name : "No file selected"}
                </span>
              </div>
            </div>

            {/* Preview Table */}
            {previewData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Preview
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(previewData[0]).map((header) => (
                          <th
                            key={header}
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value, i) => (
                            <td
                              key={i}
                              className="px-4 py-2 text-sm text-gray-600 border-b"
                            >
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !file}
                className={`px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ${
                  loading || !file ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Importing..." : "Import Books"}
              </button>
            </div>
          </form>

          {/* Feedback Messages */}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <p className="text-green-700">Books imported successfully!</p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportPage;
