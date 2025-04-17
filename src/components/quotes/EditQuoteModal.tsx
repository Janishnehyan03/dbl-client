import { useState, useEffect } from "react";
import { IQuote } from "../../utils/types";

interface EditQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: IQuote | null;
  onSubmit: (formData: { text: string; author: string }) => Promise<void>;
  loading: boolean;
}

const EditQuoteModal: React.FC<EditQuoteModalProps> = ({
  isOpen,
  onClose,
  quote,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({ text: "", author: "" });

  useEffect(() => {
    if (quote) {
      setFormData({ text: quote.text, author: quote.author });
    }
  }, [quote]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Quote</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="text">
              Quote Text
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="author">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuoteModal;
