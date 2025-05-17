import {
  AlertCircle,
  Book,
  CheckCircle,
  Clock,
  DollarSign,
  Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";

interface Fine {
  role: string;
  amount: number;
  period: "daily" | "weekly";
}

interface MaximumIssue {
  role: string;
  maxCount: number;
}

interface MaximumRenewal {
  role: string;
  maxRenewals: number;
}

interface IssuePolicy {
  maximumIssues: MaximumIssue[];
  maximumIssueDays: number;
}

interface RenewalPolicy {
  maximumRenewals: MaximumRenewal[];
  renewalDays: number;
}

interface LibrarySettings {
  _id?: string;
  libraryName: string;
  description: string;
  fines: Fine[];
  issuePolicy: IssuePolicy;
  renewalPolicy: RenewalPolicy;
  isClosed: boolean;
}

const GeneralSettings: React.FC = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<LibrarySettings | null>(null);
  const [formData, setFormData] = useState<any>({
    libraryName: "",
    description: "",
    fines: [
      { role: "STUDENT", amount: 0, period: "daily" },
      { role: "TEACHER", amount: 0, period: "daily" },
    ],
    issuePolicy: {
      maximumIssues: [
        { role: "STUDENT", maxCount: 3 },
        { role: "TEACHER", maxCount: 5 },
      ],
      maximumIssueDays: 14,
    },
    renewalPolicy: {
      maximumRenewals: [
        { role: "STUDENT", maxRenewals: 1 },
        { role: "TEACHER", maxRenewals: 2 },
      ],
      renewalDays: 7,
    },
    isClosed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`/library-settings`);
        if (response.data.length > 0) {
          setSettings(response.data[0]);
          setFormData(response.data[0]);
        }
      } catch (err) {
        setError("Failed to fetch settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    index?: number,
    field?: string
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      if (section && field !== undefined && index !== undefined) {
        if (section === "fines") {
          const updatedFines = [...prev.fines];
          updatedFines[index] = { ...updatedFines[index], [field]: value };
          return { ...prev, fines: updatedFines };
        } else if (section === "issuePolicy") {
          const updatedIssues = [...prev.issuePolicy.maximumIssues];
          updatedIssues[index] = {
            ...updatedIssues[index],
            [field]: Number(value),
          };
          return {
            ...prev,
            issuePolicy: { ...prev.issuePolicy, maximumIssues: updatedIssues },
          };
        } else if (section === "renewalPolicy") {
          const updatedRenewals = [...prev.renewalPolicy.maximumRenewals];
          updatedRenewals[index] = {
            ...updatedRenewals[index],
            [field]: Number(value),
          };
          return {
            ...prev,
            renewalPolicy: {
              ...prev.renewalPolicy,
              maximumRenewals: updatedRenewals,
            },
          };
        }
      } else if (section) {
        return {
          ...prev,
          [section]:
            typeof prev[section as keyof LibrarySettings] === "object" &&
            prev[section as keyof LibrarySettings] !== null
              ? {
                  ...(prev[section as keyof LibrarySettings] as object),
                  [name]: Number(value),
                }
              : { [name]: Number(value) },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.libraryName.trim()) {
        throw new Error("Library name is required.");
      }
      if (formData.fines.some((fine: any) => fine.amount < 0)) {
        throw new Error("Fine amounts must be non-negative.");
      }
      if (formData.issuePolicy.maximumIssueDays <= 0) {
        throw new Error("Maximum issue days must be positive.");
      }
      if (formData.renewalPolicy.renewalDays <= 0) {
        throw new Error("Renewal days must be positive.");
      }
      if (
        formData.issuePolicy.maximumIssues.find(
          (i: any) => i.role === "Student"
        )?.maxCount >
        formData.issuePolicy.maximumIssues.find(
          (i: any) => i.role === "Teacher"
        )?.maxCount
      ) {
        throw new Error("Student max issue count cannot exceed teacher's.");
      }
      if (
        formData.renewalPolicy.maximumRenewals.find(
          (r: any) => r.role === "Student"
        )?.maxRenewals >
        formData.renewalPolicy.maximumRenewals.find(
          (r: any) => r.role === "Teacher"
        )?.maxRenewals
      ) {
        throw new Error("Student max renewals cannot exceed teacher's.");
      }

      // Save to backend
      if (settings?._id) {
        await Axios.patch(`/library-settings/${settings._id}`, formData);
      } else {
        await Axios.post(`/library-settings`, formData);
      }
      setSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 text-indigo-600" size={32} />
            General Settings
          </h1>
          <button
            onClick={() => navigate("/admin")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Book className="mr-2 text-indigo-600" size={20} />
                Library Name
              </label>
              <input
                type="text"
                name="libraryName"
                value={formData.libraryName}
                onChange={handleInputChange}
                placeholder="Enter library name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Book className="mr-2 text-indigo-600" size={20} />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter library description"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <DollarSign className="mr-2 text-indigo-600" size={20} />
                Fines
              </label>
              {formData.fines.map((fine: any, index: number) => (
                <div key={fine.role} className="flex space-x-4 mb-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">
                      {fine.role} Fine ($/day)
                    </label>
                    <input
                      type="number"
                      value={fine.amount}
                      onChange={(e) =>
                        handleInputChange(e, "fines", index, "amount")
                      }
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Book className="mr-2 text-indigo-600" size={20} />
                Issue Policy
              </label>
              {formData.issuePolicy.maximumIssues.map(
                (issue: any, index: number) => (
                  <div key={issue.role} className="flex space-x-4 mb-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">
                        {issue.role} Max Books
                      </label>
                      <input
                        type="number"
                        value={issue.maxCount}
                        onChange={(e) =>
                          handleInputChange(e, "issuePolicy", index, "maxCount")
                        }
                        min="1"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                )
              )}
              <div className="mt-2">
                <label className="text-xs text-gray-500">Max Issue Days</label>
                <input
                  type="number"
                  name="maximumIssueDays"
                  value={formData.issuePolicy.maximumIssueDays}
                  onChange={(e) => handleInputChange(e, "issuePolicy")}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="mr-2 text-indigo-600" size={20} />
                Renewal Policy
              </label>
              {formData.renewalPolicy.maximumRenewals.map(
                (renewal: any, index: number) => (
                  <div key={renewal.role} className="flex space-x-4 mb-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">
                        {renewal.role} Max Renewals
                      </label>
                      <input
                        type="number"
                        value={renewal.maxRenewals}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            "renewalPolicy",
                            index,
                            "maxRenewals"
                          )
                        }
                        min="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                )
              )}
              <div className="mt-2">
                <label className="text-xs text-gray-500">Renewal Days</label>
                <input
                  type="number"
                  name="renewalDays"
                  value={formData.renewalPolicy.renewalDays}
                  onChange={(e) => handleInputChange(e, "renewalPolicy")}
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Settings className="mr-2 text-indigo-600" size={20} />
                Library Status
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isClosed"
                  checked={formData.isClosed}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      isClosed: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Library is Closed
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>

        {success && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center max-w-2xl mx-auto">
            <CheckCircle className="text-green-500 mr-3" size={20} />
            <p className="text-green-700">Settings saved successfully!</p>
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center max-w-2xl mx-auto">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSettings;
