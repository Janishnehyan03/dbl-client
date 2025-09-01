import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Languages, Plus, Edit, Trash2 } from "lucide-react";
import Axios from "../../utils/Axios";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import { ILanguage } from "../../utils/types";

const LanguagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<ILanguage | null>(
    null
  );
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/languages");
        setLanguages(response.data);
      } catch (err) {
        setError("Failed to fetch languages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ name: "", code: "" });
    setIsAddModalOpen(true);
    setError(null);
  };

  const openEditModal = (language: ILanguage) => {
    setCurrentLanguage(language);
    setFormData({ name: language.name, code: language.code });
    setIsEditModalOpen(true);
    setError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name) {
        throw new Error("Language name is required.");
      }
      if (!formData.code) {
        throw new Error("Language code is required.");
      }
      if (formData.code.length !== 2) {
        throw new Error(
          "Language code must be exactly 2 characters (e.g., EN)."
        );
      }

      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
      };

      const response = await Axios.post("/languages", payload);
      setLanguages([...languages, response.data]);
      setSuccess(true);
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to add language."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLanguage) return;

    setLoading(true);
    setError(null);

    try {
      if (!formData.name) {
        throw new Error("Language name is required.");
      }
      if (!formData.code) {
        throw new Error("Language code is required.");
      }
      if (formData.code.length !== 2) {
        throw new Error(
          "Language code must be exactly 2 characters (e.g., EN)."
        );
      }

      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
      };

      const response = await Axios.patch(
        `/languages/${currentLanguage._id}`,
        payload
      );
      setLanguages(
        languages.map((lang) =>
          lang._id === currentLanguage._id ? response.data : lang
        )
      );
      setSuccess(true);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update language."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      try {
        setLoading(true);
        setError(null);
        await Axios.delete(`/languages/${id}`);
        setLanguages(languages.filter((lang) => lang._id !== id));
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete language.");
      } finally {
        setLoading(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Languages className="mr-3 text-indigo-600" size={32} />
            Languages
          </h1>
          <div className="space-x-4">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <Plus className="mr-2" size={20} />
              Add Language
            </button>
            <button
              onClick={() => navigate("/catalog/books")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to Books
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && <LoadingSpinner className="mb-4" />}

        {/* Languages Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {languages.length === 0 && !loading ? (
            <p className="text-gray-600 text-center">No languages found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Code
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {languages.map((language) => (
                    <tr key={language._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {language.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {language.code}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        <button
                          onClick={() => openEditModal(language)}
                          className="text-indigo-600 hover:text-indigo-800 mr-4"
                          disabled={loading}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(language._id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={loading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {success && (
          <FeedbackMessage
            success={true}
            message="Action completed successfully!"
          
          />
        )}
        {error && (
          <FeedbackMessage success={false} message={error}  />
        )}

        {/* Add Language Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Add New Language
              </h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter language name (e.g., English)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter language code (e.g., EN)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    maxLength={2}
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Language"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Language Modal */}
        {isEditModalOpen && currentLanguage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Edit Language
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter language name (e.g., English)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter language code (e.g., EN)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    maxLength={2}
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguagesPage;
