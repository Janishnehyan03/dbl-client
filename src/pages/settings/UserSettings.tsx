import {
    AlertCircle,
    CheckCircle,
    User,
    Mail,
    Bell,
    Lock,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserSettings: React.FC = () => {
  const navigate = useNavigate();

  // Demo initial user settings data (replace with API fetch in a real app)
  const [userSettings, setUserSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    notificationsEnabled: true,
    password: "", // Password is not pre-filled for security reasons
  });

  const [formData, setFormData] = useState({ ...userSettings });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Validation
        if (!formData.name.trim()) {
          throw new Error("Name is required.");
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
          throw new Error("Please enter a valid email address.");
        }
        if (formData.password && formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }

        // Simulate saving to backend
        setUserSettings({ ...formData });
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
            <User className="mr-3 text-indigo-600" size={32} />
            User Settings
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="mr-2 text-indigo-600" size={20} />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="mr-2 text-indigo-600" size={20} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Notifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Bell className="mr-2 text-indigo-600" size={20} />
                Notifications
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="notificationsEnabled"
                  checked={formData.notificationsEnabled}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable notifications
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Lock className="mr-2 text-indigo-600" size={20} />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to keep current password.
              </p>
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

export default UserSettings;