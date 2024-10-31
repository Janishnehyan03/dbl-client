import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import Axios from "../../../../utils/Axios";

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
      } catch (error: any) {
        console.log(error.response);
      }
    }
  };

  const handleRemoveAuthor = async (removedAuthor: Author) => {
    try {
      await Axios.delete(`/books/${bookId}/author/${removedAuthor._id}`);
      setSelectedAuthors((prev) =>
        prev.filter((author) => author._id !== removedAuthor._id)
      );
      getBook();
    } catch (error: any) {
      console.error("Failed to remove author:", error.response);
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
    <div className="w-full space-y-6 md:space-y-0 md:flex md:space-x-8">
      <div className="md:flex-1">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Selected Authors
        </h3>
        <ul className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-sm">
          {selectedAuthors.length === 0 ? (
            <li className="p-2 text-gray-500 text-center">
              No authors selected
            </li>
          ) : (
            selectedAuthors.map((author) => (
              <li
                key={author._id}
                className="flex justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                <span>
                  {author.firstName} {author.lastName}
                </span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveAuthor(author)}
                >
                  <Trash />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="relative w-full md:w-1/2">
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4"
          autoComplete="off"
        />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Available Authors
        </h3>
        <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-sm">
          {filteredAuthors.length === 0 ? (
            <li className="p-2 text-gray-500 text-center">
              No matching authors found
            </li>
          ) : (
            filteredAuthors.map((author) => (
              <li
                key={author._id}
                className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleSelectAuthor(author)}
              >
                <span>
                  {author.firstName} {author.lastName}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AuthorInput;
