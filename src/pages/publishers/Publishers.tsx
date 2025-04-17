import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Axios from "../../utils/Axios";

interface Publisher {
  _id: string;
  name: string;
  location?: string;
  address?: string;
  email?: string;
  phone?: string;
}

const PublishersPage: React.FC = () => {
  const navigate = useNavigate();

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPublisher, setCurrentPublisher] = useState<Publisher | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/publishers");
      setPublishers(response.data);
    } catch (err: any) {
      setError("Failed to fetch publishers");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ name: "", location: "", email: "", phone: "", address: "" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (publisher: Publisher) => {
    setCurrentPublisher(publisher);
    setFormData({
      name: publisher.name,
      location: publisher.location || "",
      email: publisher.email || "",
      phone: publisher.phone || "",
      address: publisher.address || "",
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name) {
        throw new Error("Publisher name is required.");
      }

      const response = await Axios.post("/publishers", formData);
      setPublishers((prev) => [...prev, response.data]);
      setSuccess(true);
      setIsAddModalOpen(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add publisher");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name) {
        throw new Error("Publisher name is required.");
      }
      if (!currentPublisher?._id) {
        throw new Error("No publisher selected for editing");
      }

      const response = await Axios.put(
        `/publishers/${currentPublisher._id}`,
        formData
      );
      setPublishers((prev) =>
        prev.map((pub) =>
          pub._id === currentPublisher._id ? response.data : pub
        )
      );
      setSuccess(true);
      setIsEditModalOpen(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update publisher");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this publisher?")) {
      setLoading(true);
      setError(null);

      try {
        await Axios.delete(`/publishers/${id}`);
        setPublishers((prev) => prev.filter((pub) => pub._id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete publisher");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building className="mr-3 text-indigo-600" size={32} />
            Publishers
          </h1>
          <div className="space-x-4">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <Plus className="mr-2" size={20} />
              Add Publisher
            </button>
            <button
              onClick={() => navigate("/catalog/books")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to Books
            </button>
          </div>
        </div>

        {/* Publishers Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading && !publishers.length ? (
            <p className="text-gray-600 text-center">Loading publishers...</p>
          ) : publishers.length === 0 ? (
            <p className="text-gray-600 text-center">No publishers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Location
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {publishers.map((publisher) => (
                    <tr key={publisher._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {publisher.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {publisher.location || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {publisher.email || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {publisher.phone || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        <button
                          onClick={() => openEditModal(publisher)}
                          className="text-indigo-600 hover:text-indigo-800 mr-4"
                          disabled={loading}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(publisher._id)}
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
          <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center">
            <CheckCircle className="text-green-500 mr-3" size={20} />
            <p className="text-green-700">Action completed successfully!</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Add Publisher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Add New Publisher
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter publisher name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address (optional)
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  disabled={loading}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Adding..." : "Add Publisher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Publisher Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Publisher
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter publisher name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  disabled={loading}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishersPage;
