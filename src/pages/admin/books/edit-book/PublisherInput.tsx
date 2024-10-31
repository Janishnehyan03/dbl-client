import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import Axios from "../../../../utils/Axios";
import toast from "react-hot-toast";

interface Publisher {
  _id: string;
  publisherName: string;
}

interface PublisherProps {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  publishers?: any[]; // Array of pre-selected publisher IDs
  bookId: any;
  getBook: any;
}

const PublisherInput: React.FC<PublisherProps> = ({
  bookId,
  publishers = [],
  getBook,
}) => {
  const [selectedPublishers, setSelectedPublishers] = useState<Publisher[]>([]);
  const [allPublishers, setAllPublishers] = useState<Publisher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await Axios.get("/publishers");
        setAllPublishers(response.data);
      } catch (err) {
        setError("Failed to fetch publishers");
        console.error("Error fetching publishers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishers();
  }, []);

  useEffect(() => {
    if (publishers.length > 0) {
      const initialSelectedPublishers = publishers
        .map((pub) =>
          allPublishers.find((publisher) => publisher._id === pub?._id)
        )
        .filter(Boolean) as Publisher[];

      setSelectedPublishers(initialSelectedPublishers);
    }
  }, [publishers, allPublishers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSelectPublisher = async (publisher: Publisher) => {
    if (!selectedPublishers.find((p) => p._id === publisher._id)) {
      try {
        setSelectedPublishers((prev) => [...prev, publisher]);
        await Axios.patch(`/books/${bookId}/publisher/${publisher._id}`);
        getBook();
        toast.success("Publisher added");
      } catch (error: any) {
        console.log(error.response);
      }
    }
  };

  const handleRemovePublisher = async (removedPublisher: Publisher) => {
    try {
      await Axios.delete(`/books/${bookId}/publisher/${removedPublisher._id}`);
      setSelectedPublishers((prev) =>
        prev.filter((publisher) => publisher._id !== removedPublisher._id)
      );
      getBook();
      toast.success("Publisher removed");
    } catch (error: any) {
      console.error("Failed to remove publisher:", error.response);
    }
  };

  if (isLoading) {
    return <div className="w-full text-center py-4">Loading publishers...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-4 text-red-500">{error}</div>;
  }

  const filteredPublishers = allPublishers.filter((publisher) => {
    const isSelected = selectedPublishers.find(
      (selected) => selected._id === publisher._id
    );
    return (
      !isSelected && publisher.publisherName.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="w-full space-y-6 md:space-y-0 md:flex md:space-x-8">
      <div className="md:flex-1">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Selected Publishers
        </h3>
        <ul className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-sm">
          {selectedPublishers.length === 0 ? (
            <li className="p-2 text-gray-500 text-center">
              No publishers selected
            </li>
          ) : (
            selectedPublishers.map((publisher) => (
              <li
                key={publisher._id}
                className="flex justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                <span>{publisher.publisherName}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemovePublisher(publisher)}
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
          Search Publishers
        </label>
        <input
          type="text"
          id="search"
          name="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Type to search publishers"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4"
          autoComplete="off"
        />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Available Publishers
        </h3>
        <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-white shadow-sm">
          {filteredPublishers.length === 0 ? (
            <li className="p-2 text-gray-500 text-center">
              No matching publishers found
            </li>
          ) : (
            filteredPublishers.map((publisher) => (
              <li
                key={publisher._id}
                className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => handleSelectPublisher(publisher)}
              >
                <span>{publisher.publisherName}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default PublisherInput;
