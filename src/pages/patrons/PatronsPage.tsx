import { ArrowLeft, Upload, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatronExcelImportModal from "../../components/patrons/PatronExcelImport";
import PatronFilters from "../../components/patrons/PatronFilters";
import PatronsTable from "../../components/patrons/PatronsTable";
import { fetchPatrons } from "../../utils/services/patronService";

const PatronsPage: React.FC = () => {
  const navigate = useNavigate();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [patrons, setPatrons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState(""); // New state for selected role

  const getPatrons = async () => {
    try {
      let data = await fetchPatrons();
      setPatrons(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPatrons();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="text-gray-600" size={20} />
              </button>
              <div className="flex items-center">
                <Users className="mr-3 text-indigo-600" size={28} />
                <h1 className="text-2xl font-bold text-gray-900">
                  Patron Management
                </h1>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search patrons...`}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Upload className="mr-2" size={16} />
                  Import Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Tabs */}
          {/* <div className="border-b border-gray-200">
            <PatronTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div> */}

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <PatronFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedDivision={selectedDivision}
              setSelectedDivision={setSelectedDivision}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedRole={selectedRole} // Pass selected role to filters
              setSelectedRole={setSelectedRole}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <PatronsTable
              searchQuery={searchQuery}
              selectedSection={selectedSection}
              selectedClass={selectedClass}
              selectedDivision={selectedDivision}
              selectedDepartment={selectedDepartment}
              selectedRole={selectedRole} // Pass selected role to table
              patrons={patrons}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </main>

      {/* Import Modal */}
      <PatronExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          getPatrons();
          setIsImportModalOpen(false);
        }}
      />
    </div>
  );
};

export default PatronsPage;
