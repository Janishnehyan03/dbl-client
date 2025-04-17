import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Quote, Plus } from "lucide-react";
import Axios from "../../utils/Axios";
import QuoteTable from "../../components/quotes/QuoteTable";
import AddQuoteModal from "../../components/quotes/AddQuoteModal";
import EditQuoteModal from "../../components/quotes/EditQuoteModal";
import FeedbackMessage from "../../components/ui/FeedbackMessage";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export interface IQuote {
  id: string;
  text: string;
  author: string;
}

const API_URL = `/quotes`;

const QuotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<IQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch quotes from API
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(API_URL);
        setQuotes(response.data);
      } catch (err: any) {
        setError("Failed to fetch quotes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setError(null);
  };

  const openEditModal = (quote: IQuote) => {
    setCurrentQuote(quote);
    setIsEditModalOpen(true);
    setError(null);
  };

  const handleAddSubmit = async (formData: {
    text: string;
    author: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios.post(API_URL, formData);
      setQuotes([...quotes, response.data]);
      setSuccess(true);
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to add quote. Please try again."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleEditSubmit = async (formData: {
    text: string;
    author: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios.patch(
        `${API_URL}/${currentQuote?.id}`,
        formData
      );
      setQuotes(
        quotes.map((quote) =>
          quote.id === currentQuote?.id ? response.data : quote
        )
      );
      setSuccess(true);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update quote. Please try again."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      try {
        setLoading(true);
        setError(null);
        await Axios.delete(`${API_URL}/${id}`);
        setQuotes(quotes.filter((quote) => quote.id !== id));
        setSuccess(true);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to delete quote. Please try again."
        );
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
            <Quote className="mr-3 text-indigo-600" size={32} />
            Quotes
          </h1>
          <div className="space-x-4">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
              disabled={loading}
            >
              <Plus className="mr-2" size={20} />
              Add Quote
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

        {/* Quotes Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <QuoteTable
            quotes={quotes}
            loading={loading}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>

        {/* Modals */}
        <AddQuoteModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          loading={loading}
        />

        <EditQuoteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          quote={currentQuote}
          onSubmit={handleEditSubmit}
          loading={loading}
        />

        {/* Feedback Messages */}
        {success && (
          <FeedbackMessage
            type="success"
            message="Action completed successfully!"
            className="mt-4"
          />
        )}
        {error && (
          <FeedbackMessage type="error" message={error} className="mt-4" />
        )}
      </div>
    </div>
  );
};

export default QuotesPage;
