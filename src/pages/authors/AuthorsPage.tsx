import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Plus } from "lucide-react";
import Axios from "../../utils/Axios";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import AuthorsTable from "../admin/components/authors/AuthorTable";
import AddAuthorModal from "../admin/components/authors/AddAuthorModal";
import EditAuthorModal from "../admin/components/authors/EditAuthorModal";
import SearchBar from "../../components/ui/SearchBar";
import { IAuthor } from "../../utils/types";

const AuthorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState<IAuthor[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<IAuthor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<IAuthor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = authors.filter(
      (author) =>
        author.name.toLowerCase().includes(lowercasedSearchTerm) ||
        author.email?.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredAuthors(results);
  }, [searchTerm, authors]);

  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.get("/authors");
      setAuthors(response.data);
    } catch (err) {
      setError("Failed to fetch authors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAuthor = async (
    newAuthor: Omit<IAuthor, "_id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.post("/authors", newAuthor);
      setAuthors((prev) => [...prev, response.data]);
      setSuccess(true);
      setIsAddModalOpen(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to add author. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditAuthor = async (
    id: string,
    updatedAuthor: Omit<IAuthor, "_id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.patch(`/authors/${id}`, updatedAuthor);
      setAuthors((prev) =>
        prev.map((auth) => (auth._id === id ? response.data : auth))
      );
      setSuccess(true);
      setIsEditModalOpen(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update author. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      setLoading(true);
      setError(null);
      try {
        await Axios.delete(`/authors/${id}`);
        setAuthors((prev) => prev.filter((auth) => auth._id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to delete author. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = (author: IAuthor) => {
    setCurrentAuthor(author);
    setIsEditModalOpen(true);
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
          <div className="space-x-4 flex items-center">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <button
              onClick={() => setIsAddModalOpen(true)}
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

        {/* Feedback Messages */}
        <FeedbackMessage
          success={success}
          message={error || (success ? "Action completed successfully!" : "")}
        />

        {/* Authors Table */}
        <AuthorsTable
          authors={filteredAuthors}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDeleteAuthor}
        />
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddAuthorModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddAuthor}
          loading={loading}
          error={error}
        />
      )}
      {isEditModalOpen && currentAuthor && (
        <EditAuthorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          author={currentAuthor}
          onSubmit={handleEditAuthor}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default AuthorsPage;
