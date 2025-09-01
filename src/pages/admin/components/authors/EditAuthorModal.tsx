import React, { useState, useEffect } from "react";
import { IAuthor } from "../../../../utils/types";

interface EditAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: IAuthor;
  onSubmit: (_id: string, author: IAuthor) => void;
  loading: boolean;
  error: string | null;
}

const EditAuthorModal: React.FC<EditAuthorModalProps> = ({
  isOpen,
  onClose,
  author,
  onSubmit,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState<{
    _id: string;
    name: string;
    email: string;
    website: string;
  }>({
    _id: author._id || "",
    name: author.name || "",
    email: author.email || "",
    website: author.website || "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    // Update form data when author prop changes (e.g., when a new author is selected for edit)
    setFormData({
      _id: author._id || "",
      name: author.name || "",
      email: author.email || "",
      website: author.website || "",
    });
  }, [author]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError(null); // Clear local error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setLocalError("Name and email are required fields.");
      return;
    }
    if (!author._id) {
      setLocalError("Author ID is missing.");
      return;
    }
    onSubmit(author._id, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Author</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
          </div>
          {(localError || error) && (
            <p className="text-red-600 text-sm mt-2">{localError || error}</p>
          )}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default EditAuthorModal;
