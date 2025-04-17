import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Plus, Edit, Trash2 } from "lucide-react";
import Axios from "../../utils/Axios";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import FeedbackMessage from "../../components/ui/FeedbackMessage";

interface IAuthor {
  _id: string;
  name: string;
  bio?: string;
  nationality?: string;
  email: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AuthorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<IAuthor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    nationality: "",
    email: "",
    website: "",
    linkedin: "",
    twitter: "",
    facebook: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch authors from API
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/authors");
        setAuthors(response.data);
      } catch (err) {
        setError("Failed to fetch authors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      bio: "",
      nationality: "",
      email: "",
      website: "",
      linkedin: "",
      twitter: "",
      facebook: ""
    });
    setIsAddModalOpen(true);
    setError(null);
  };

  const openEditModal = (author: IAuthor) => {
    setCurrentAuthor(author);
    setFormData({
      name: author.name,
      bio: author.bio || "",
      nationality: author.nationality || "",
      email: author.email,
      website: author.website || "",
      linkedin: author.linkedin || "",
      twitter: author.twitter || "",
      facebook: author.facebook || ""
    });
    setIsEditModalOpen(true);
    setError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name ) {
        throw new Error("Name and email are required fields.");
      }

      const response = await Axios.post("/authors", formData);
      setAuthors([...authors, response.data]);
      setSuccess(true);
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add author. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAuthor) return;
    
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.email) {
        throw new Error("Name and email are required fields.");
      }

      const response = await Axios.patch(`/authors/${currentAuthor._id}`, formData);
      setAuthors(authors.map(auth => 
        auth._id === currentAuthor._id ? response.data : auth
      ));
      setSuccess(true);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update author. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      try {
        setLoading(true);
        setError(null);
        await Axios.delete(`/authors/${id}`);
        setAuthors(authors.filter(auth => auth._id !== id));
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete author. Please try again.");
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
            <User className="mr-3 text-indigo-600" size={32} />
            Authors
          </h1>
          <div className="space-x-4">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <Plus className="mr-2" size={20} />
              Add Author
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

        {/* Authors Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {authors.length === 0 && !loading ? (
            <p className="text-gray-600 text-center">No authors found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Nationality
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author) => (
                    <tr key={author._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {author.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {author.nationality || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        {author.email}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 border-b">
                        <button
                          onClick={() => openEditModal(author)}
                          className="text-indigo-600 hover:text-indigo-800 mr-4"
                          disabled={loading}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(author._id)}
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
            type="success"
            message="Action completed successfully!"
            className="mt-4"
          />
        )}
        {error && (
          <FeedbackMessage
            type="error"
            message={error}
            className="mt-4"
          />
        )}

        {/* Add Author Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Author</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
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
                      Email 
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      // required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                 
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
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
                    {loading ? "Adding..." : "Add Author"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Author Modal */}
        {isEditModalOpen && currentAuthor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Author</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
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
                      Email *
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
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
        
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
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

export default AuthorsPage;