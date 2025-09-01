import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Plus } from "lucide-react";
import Axios from "../../utils/Axios";
import { IPublisher } from "../../utils/types"; // Assuming you create a types file
import PublisherTable from "../admin/components/publishers/PublisherTable";
import AddPublisherModal from "../admin/components/publishers/AddPublisherModal";
import EditPublisherModal from "../admin/components/publishers/EditPublisherModal";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import SearchBar from "../../components/ui/SearchBar";

const PublishersPage: React.FC = () => {
  const navigate = useNavigate();

  const [publishers, setPublishers] = useState<IPublisher[]>([]);
  const [filteredPublishers, setFilteredPublishers] = useState<IPublisher[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPublisher, setCurrentPublisher] = useState<IPublisher | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPublishers();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = publishers.filter(
      (publisher) =>
        publisher.name.toLowerCase().includes(lowercasedSearchTerm) ||
        (publisher.location &&
          publisher.location.toLowerCase().includes(lowercasedSearchTerm)) ||
        (publisher.email &&
          publisher.email.toLowerCase().includes(lowercasedSearchTerm))
    );
    setFilteredPublishers(results);
  }, [searchTerm, publishers]);

  const fetchPublishers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.get("/publishers");
      setPublishers(response.data);
    } catch (err: any) {
      setError("Failed to fetch publishers");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPublisher = async (newPublisher: Omit<IPublisher, "_id">) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.post("/publishers", newPublisher);
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

  const handleEditPublisher = async (
    id: string,
    updatedPublisher: Omit<IPublisher, "_id">
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Axios.put(`/publishers/${id}`, updatedPublisher);
      setPublishers((prev) =>
        prev.map((pub) => (pub._id === id ? response.data : pub))
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

  const handleDeletePublisher = async (id: string) => {
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

  const openEditModal = (publisher: IPublisher) => {
    setCurrentPublisher(publisher);
    setIsEditModalOpen(true);
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
          <div className="space-x-4 flex items-center">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <button
              onClick={() => setIsAddModalOpen(true)}
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

        {/* Feedback Messages */}
        <FeedbackMessage success={success} message={error} />

        {/* Publishers Table */}
        <PublisherTable
          publishers={filteredPublishers}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDeletePublisher}
        />
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddPublisherModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPublisher}
          loading={loading}
          error={error} // Pass error to modal if needed for internal validation messages
        />
      )}
      {isEditModalOpen && currentPublisher && (
        <EditPublisherModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          publisher={currentPublisher}
          onSubmit={handleEditPublisher}
          loading={loading}
          error={error} // Pass error to modal if needed
        />
      )}
    </div>
  );
};

export default PublishersPage;
