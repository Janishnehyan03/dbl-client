import React, { useState, useEffect } from 'react';
import Axios from '../../../utils/Axios';

interface Quote {
  _id?: string;
  text: string;
  author: string;
}

const DailyQuotesAdmin: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [newQuote, setNewQuote] = useState<Quote>({ text: '', author: '' });
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const fetchQuotes = async () => {
    try {
      const response = await Axios.get('/dailyQuotes');
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const createQuote = async () => {
    try {
      const response = await Axios.post('/dailyQuotes', newQuote);
      setQuotes([...quotes, response.data]);
      setNewQuote({ text: '', author: '' });
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  const updateQuote = async (id: string) => {
    try {
      const response = await Axios.put(`/dailyQuotes/${id}`, editingQuote);
      setQuotes(quotes.map((quote) => (quote._id === id ? response.data : quote)));
      setEditingQuote(null);
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      await Axios.delete(`/dailyQuotes/${id}`);
      setQuotes(quotes.filter((quote) => quote._id !== id));
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Daily Quotes</h1>

      {/* Add New Quote */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Quote</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Quote Text"
            value={newQuote.text}
            onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-blue-200"
          />
          <input
            type="text"
            placeholder="Author"
            value={newQuote.author}
            onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
            className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring focus:ring-blue-200"
          />
          <button
            onClick={createQuote}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Add Quote
          </button>
        </div>
      </div>

      {/* Existing Quotes */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Quotes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote) => (
            <div key={quote._id} className="bg-white rounded-lg shadow-lg p-4">
              {editingQuote && editingQuote._id === quote._id ? (
                <>
                  <input
                    type="text"
                    value={editingQuote.text}
                    onChange={(e) =>
                      setEditingQuote({ ...editingQuote, text: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-lg shadow-sm p-3 mb-3 focus:ring focus:ring-green-200"
                  />
                  <input
                    type="text"
                    value={editingQuote.author}
                    onChange={(e) =>
                      setEditingQuote({ ...editingQuote, author: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-lg shadow-sm p-3 mb-3 focus:ring focus:ring-green-200"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => updateQuote(quote._id!)}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingQuote(null)}
                      className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg italic text-gray-700 mb-2">{quote.text}</p>
                  <p className="text-sm font-medium text-gray-600">- {quote.author}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setEditingQuote(quote)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuote(quote._id!)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyQuotesAdmin;
