import {
    AlertCircle,
    Book,
    CheckCircle,
    Clock,
    DollarSign,
    Settings,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GeneralSettings: React.FC = () => {
  const navigate = useNavigate();

  // Demo initial settings data (replace with API fetch in a real app)
  const [settings, setSettings] = useState({
    libraryName: "Central Library",
    openingHours: "08:00-18:00",
    fineRatePerDay: 0.5,
    maxLoanPeriod: 14,
  });

  const [formData, setFormData] = useState({ ...settings });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Validation
        if (!formData.libraryName.trim()) {
          throw new Error("Library name is required.");
        }
        const [open, close] = formData.openingHours.split("-");
        if (
          !open ||
          !close ||
          !/^\d{2}:\d{2}$/.test(open) ||
          !/^\d{2}:\d{2}$/.test(close)
        ) {
          throw new Error(
            "Opening hours must be in HH:MM-HH:MM format (e.g., 08:00-18:00)."
          );
        }
        if (
          isNaN(Number(formData.fineRatePerDay)) ||
          Number(formData.fineRatePerDay) < 0
        ) {
          throw new Error("Fine rate must be a positive number.");
        }
        if (
          isNaN(Number(formData.maxLoanPeriod)) ||
          Number(formData.maxLoanPeriod) <= 0
        ) {
          throw new Error("Max loan period must be a positive integer.");
        }

        // Simulate saving to backend
        setSettings({ ...formData });
        setSuccess(true);
        setLoading(false);
        setTimeout(() => setSuccess(false), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
        setLoading(false);
      }
    }, 1000); // Simulated delay
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8 transition-all duration-300">
        {/* Header */}
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

        {/* Settings Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Library Name */}
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

            {/* Opening Hours */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="mr-2 text-indigo-600" size={20} />
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleInputChange}
                placeholder="e.g., 08:00-18:00"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: HH:MM-HH:MM (24-hour)
              </p>
            </div>

            {/* Fine Rate Per Day */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <DollarSign className="mr-2 text-indigo-600" size={20} />
                Fine Rate Per Day ($)
              </label>
              <input
                type="number"
                name="fineRatePerDay"
                value={formData.fineRatePerDay}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                placeholder="Enter fine rate per day"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Max Loan Period */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Book className="mr-2 text-indigo-600" size={20} />
                Max Loan Period (days)
              </label>
              <input
                type="number"
                name="maxLoanPeriod"
                value={formData.maxLoanPeriod}
                onChange={handleInputChange}
                min="1"
                placeholder="Enter max loan period"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Submit Button */}
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

        {/* Feedback Messages */}
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
