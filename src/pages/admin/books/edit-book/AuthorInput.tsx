import React, { useEffect, useState } from "react";
import Axios from "../../../../utils/Axios";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
}

interface AuthorProps {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  authors?: any[]; // Array of pre-selected author IDs
  bookId: any;
  getBook: any;
}

const AuthorInput: React.FC<AuthorProps> = ({
  bookId,
  authors = [],
  getBook, // Default to empty array if not provided
}) => {
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ firstName: "", lastName: "" });

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await Axios.get("/authors");
        setAllAuthors(response.data);
      } catch (err) {
        setError("Failed to fetch authors");
        console.error("Error fetching authors:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    if (authors.length > 0) {
      const initialSelectedAuthors = authors
        .map((atr) => allAuthors.find((author) => author._id === atr?._id))
        .filter(Boolean) as Author[];

      setSelectedAuthors(initialSelectedAuthors);
    }
  }, [authors, allAuthors]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSelectAuthor = async (author: Author) => {
    if (!selectedAuthors.find((a) => a._id === author._id)) {
      setSelectedAuthors((prev) => [...prev, author]);
      try {
        await Axios.patch(`/books/${bookId}/author/${author._id}`);
        getBook();
        toast.success("Author added")
      } catch (error: any) {
        console.log(error.response);
      }
    }
  };

  const handleRemoveAuthor = async (e: any, removedAuthor: Author) => {
    e.preventDefault()
    try {
      await Axios.delete(`/books/${bookId}/author/${removedAuthor._id}`);
      setSelectedAuthors((prev) =>
        prev.filter((author) => author._id !== removedAuthor._id)
      );
      getBook();
      toast.success("Author removed")
    } catch (error: any) {
      console.error("Failed to remove author:", error.response);
    }
  };

  const handleSaveAuthor = async (e: any) => {
    e.preventDefault();
    try {
      await Axios.post("/authors", newAuthor);
      setShowModal(false);
      setNewAuthor({ firstName: "", lastName: "" });
      // Reload all authors after saving
      toast.success("Author added");
      const response = await Axios.get("/authors");
      setAllAuthors(response.data);
    } catch (error: any) {
      console.error("Failed to save author:", error.response);
    }
  };

  if (isLoading) {
    return <div className="w-full text-center py-4">Loading authors...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-4 text-red-500">{error}</div>;
  }

  const filteredAuthors = allAuthors.filter((author) => {
    const isSelected = selectedAuthors.find(
      (selected) => selected._id === author._id
    );
    return (
      !isSelected &&
      `${author.firstName} ${author.lastName}`
        .toLowerCase()
        .includes(searchTerm)
    );
  });

  return (
    <div className="w-full space-y-6 md:space-y-0 md:flex md:space-x-8 p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="md:flex-1 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Selected Authors
        </h3>
        <ul className="mt-2 max-h-80 overflow-y-auto border border-gray-300 rounded-md bg-gray-50 shadow">
          {selectedAuthors.length === 0 ? (
            <li className="p-4 text-gray-500 text-center italic">
              No authors selected
            </li>
          ) : (
            selectedAuthors.map((author) => (
              <li
                key={author._id}
                className="flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 transition duration-200"
              >
                <span className="text-gray-800">
                  {author.firstName} {author.lastName}
                </span>
                <button
                  className="text-red-500 hover:text-red-700 transition duration-200"
                  onClick={(e) => handleRemoveAuthor(e, author)}
                  aria-label="Remove Author"
                  type="submit"
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="relative w-full md:w-1/2 bg-white rounded-lg shadow-sm p-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Search Authors
        </label>
        <input
          type="text"
          id="search"
          name="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Type to search authors"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 mb-4"
          autoComplete="off"
        />
        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="px-4 py-2 flex bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
         <Plus/> New Author
        </button>

        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
          Available Authors
        </h3>
        <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-gray-50 shadow">
          {filteredAuthors.length === 0 ? (
            <li className="p-4 text-gray-500 text-center italic">
              No matching authors found
            </li>
          ) : (
            filteredAuthors.map((author) => (
              <li
                key={author._id}
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 transition duration-200"
                onClick={() => handleSelectAuthor(author)}
              >
                <span className="text-gray-800">
                  {author.firstName} {author.lastName}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal for new author */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Author
            </h3>
            <input
              type="text"
              placeholder="First Name"
              value={newAuthor.firstName}
              onChange={(e) =>
                setNewAuthor((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newAuthor.lastName}
              onChange={(e) =>
                setNewAuthor((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSaveAuthor}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorInput;
