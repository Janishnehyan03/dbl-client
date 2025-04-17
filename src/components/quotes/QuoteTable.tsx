import { Edit, Trash2 } from "lucide-react";
import { IQuote } from "../../utils/types";

interface QuoteTableProps {
  quotes: IQuote[];
  loading: boolean;
  onEdit: (quote: IQuote) => void;
  onDelete: (id: string) => void;
}

const QuoteTable: React.FC<QuoteTableProps> = ({
  quotes,
  loading,
  onEdit,
  onDelete,
}) => {
  if (quotes.length === 0 && !loading) {
    return <p className="text-gray-600 text-center">No quotes found.</p>;
  }

  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
            Quote
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
            Author
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {quotes.map((quote) => (
          <tr key={quote.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 text-sm text-gray-600 border-b">
              "{quote.text}"
            </td>
            <td className="px-4 py-2 text-sm text-gray-600 border-b">
              {quote.author}
            </td>
            <td className="px-4 py-2 text-sm text-gray-600 border-b">
              <button
                onClick={() => onEdit(quote)}
                className="text-indigo-600 hover:text-indigo-800 mr-4"
                disabled={loading}
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(quote.id)}
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
  );
};

export default QuoteTable;
