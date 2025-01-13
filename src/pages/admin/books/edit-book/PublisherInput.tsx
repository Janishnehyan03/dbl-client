import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../../../../utils/Axios";

interface Publisher {
  _id: string;
  publisherName: string;
}

interface PublisherProps {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  publishers?: any[];
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
  const [showModal, setShowModal] = useState(false);
  const [newPublisher, setNewPublisher] = useState({ publisherName: "" });

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
        console.error(error.response);
      }
    }
  };

  const handleRemovePublisher = async (e: any, removedPublisher: Publisher) => {
    e.preventDefault()
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

  const handleSavePublisher = async (e: any) => {
    e.preventDefault();
    try {
      await Axios.post("/publishers", newPublisher);
      setShowModal(false);
      setNewPublisher({ publisherName: "" });
      toast.success("Publisher added");
      const response = await Axios.get("/publishers");
      setAllPublishers(response.data);
    } catch (error: any) {
      console.error("Failed to save publisher:", error.response);
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
    <div className="w-full space-y-6 md:space-y-0 md:flex md:space-x-8 p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="md:flex-1 bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Selected Publishers
        </h3>
        <ul className="mt-2 max-h-80 overflow-y-auto border border-gray-300 rounded-md bg-gray-50 shadow">
          {selectedPublishers.length === 0 ? (
            <li className="p-4 text-gray-500 text-center italic">
              No publishers selected
            </li>
          ) : (
            selectedPublishers.map((publisher) => (
              <li
                key={publisher._id}
                className="flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 transition duration-200"
              >
                <span>{publisher.publisherName}</span>
                <button
                  className="text-red-500 hover:text-red-700 transition duration-200"
                  onClick={(e) => handleRemovePublisher(e, publisher)}
                  aria-label="Remove Publisher"
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
        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="px-4 py-2 flex bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          <Plus /> New Publisher
        </button>

        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
          Available Publishers
        </h3>
        <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-gray-50 shadow">
          {filteredPublishers.length === 0 ? (
            <li className="p-4 text-gray-500 text-center italic">
              No matching publishers found
            </li>
          ) : (
            filteredPublishers.map((publisher) => (
              <li
                key={publisher._id}
                className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 transition duration-200"
                onClick={() => handleSelectPublisher(publisher)}
              >
                <span>{publisher.publisherName}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal for new publisher */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Publisher
            </h3>
            <input
              type="text"
              placeholder="Publisher Name"
              value={newPublisher.publisherName}
              onChange={(e) =>
                setNewPublisher((prev) => ({
                  ...prev,
                  publisherName: e.target.value,
                }))
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
                onClick={handleSavePublisher}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
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

export default PublisherInput;
