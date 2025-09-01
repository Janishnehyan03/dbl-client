import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, BookOpen, AlertCircle } from "lucide-react";
import Axios from "../../utils/Axios";

interface PopulatedField {
  _id: string;
  name?: string;
}

interface Circulation {
  _id: string;
  book: { _id: string; title: string; callNumber?: string; accNumber?: string };
  issueDate?: string;
  dueDate?: string;
  returnDate?: string;
  status?: string;
  fine?: number; // 🔹 added
  isOverdue?: boolean; // 🔹 added
}

interface Patron {
  _id: string;
  name: string;
  admissionNumber?: string;
  section?: PopulatedField | string;
  division?: PopulatedField | string;
  department?: PopulatedField | string;
  class?: PopulatedField | string;
  role?: PopulatedField | string;
  currentBooksIssued: number;
  totalBooksIssued: number;
  finesDue: number;
  circulations?: Circulation[];
}

const PatronDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patron, setPatron] = useState<Patron | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchPatron(id);
    // eslint-disable-next-line
  }, [id]);

  const fetchPatron = async (patronId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await Axios.get(`/patrons/${patronId}`);
      setPatron(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load patron details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper to get the display name (populated or string)
  const showField = (val: any) =>
    typeof val === "object" && val?.name
      ? val.name
      : val || <span className="text-gray-400">-</span>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className=" mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back
        </button>
        {loading ? (
          <div className="text-center text-gray-600">
            Loading patron details...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center mb-6">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        ) : patron ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <User className="text-indigo-600" size={40} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {patron.name}
                </h1>
                <p className="text-gray-600 text-sm">
                  Patron ID: <span className="font-mono">{patron._id}</span>
                </p>
                <p className="text-gray-500 text-xs">
                  Role: {showField(patron.role)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <span className="text-gray-700 font-medium mr-2">
                  Admission Number:
                </span>
                <span className="text-gray-700">
                  {patron.admissionNumber || (
                    <span className="text-gray-400">-</span>
                  )}
                </span>
              </div>

              {patron.section && (
                <div>
                  <span className="text-gray-700 font-medium mr-2">
                    Section:
                  </span>
                  <span className="text-gray-700">
                    {showField(patron.section)}
                  </span>
                </div>
              )}

              {patron.division && (
                <div>
                  <span className="text-gray-700 font-medium mr-2">
                    Division:
                  </span>
                  <span className="text-gray-700">
                    {showField(patron.division)}
                  </span>
                </div>
              )}

              {patron.department && (
                <div>
                  <span className="text-gray-700 font-medium mr-2">
                    Department:
                  </span>
                  <span className="text-gray-700">
                    {showField(patron.department)}
                  </span>
                </div>
              )}

              {patron.class && (
                <div>
                  <span className="text-gray-700 font-medium mr-2">Class:</span>
                  <span className="text-gray-700">
                    {showField(patron.class)}
                  </span>
                </div>
              )}

              <div>
                <span className="text-gray-700 font-medium mr-2">
                  Current Books Issued:
                </span>
                <span className="text-gray-700">
                  {patron.currentBooksIssued}
                </span>
              </div>

              <div>
                <span className="text-gray-700 font-medium mr-2">
                  Total Books Issued:
                </span>
                <span className="text-gray-700">{patron.totalBooksIssued}</span>
              </div>

              <div>
                <span className="text-gray-700 font-medium mr-2">
                  Fines Due:
                </span>
                <span
                  className={
                    patron.finesDue > 0 ? "text-red-600" : "text-gray-700"
                  }
                >
                  ₹{patron.finesDue}
                </span>
              </div>
            </div>

            {/* Circulations Table */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <BookOpen className="text-indigo-500 mr-2" size={20} />
                Circulation Records
              </h2>
              {patron.circulations && patron.circulations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg bg-white">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Book Title
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Acc Number
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Call Number
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Issue Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Due Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Return Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          Fine
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {patron.circulations.map((circ) => (
                        <tr
                          key={circ._id}
                          className={`hover:bg-gray-50 ${
                            circ.isOverdue ? "bg-red-50" : ""
                          }`} // 🔹 highlight overdue
                        >
                          <td className="px-4 py-2 text-sm border-b">
                            {circ.book.title}
                          </td>
                          <td className="px-4 py-2 text-sm border-b">
                            {circ.book.accNumber || "-"}
                          </td>
                          <td className="px-4 py-2 text-sm border-b">
                            {circ.book.callNumber || "-"}
                          </td>
                          <td className="px-4 py-2 text-sm border-b">
                            {circ.issueDate
                              ? new Date(circ.issueDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm border-b ${
                              circ.isOverdue ? "text-red-600 font-semibold" : ""
                            }`} // 🔹 red text if overdue
                          >
                            {circ.dueDate
                              ? new Date(circ.dueDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-sm border-b">
                            {circ.returnDate
                              ? new Date(circ.returnDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-sm border-b">
                            {circ.status
                              ? circ.status.charAt(0).toUpperCase() +
                                circ.status.slice(1)
                              : circ.returnDate
                              ? "Returned"
                              : "Issued"}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm border-b ${
                              circ.fine && circ.fine > 0
                                ? "text-red-600 font-bold"
                                : "text-gray-700"
                            }`}
                          >
                            ₹{circ.fine || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No circulation records.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-600 text-center">No patron found.</div>
        )}
      </div>
    </div>
  );
};

export default PatronDetailPage;
