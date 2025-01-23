import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import AddPublisherForm from "../publisher/PublisherPopUp";
import Axios from "../../../utils/Axios";
import { Publisher } from "../../../utils/types";

function Publishers() {
  const [showForm, setShowForm] = useState(false);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [sortOption, setSortOption] = useState("a-z");
  const [isEditing, setIsEditing] = useState(false);
  const [publisherId, setPublisherId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getPublishers = async () => {
    try {
      const { data } = await Axios.get("/publishers");
      setPublishers(data);
    } catch (error: any) {
      console.error("Error fetching publishers:", error.response || error);
    }
  };

  const sortPublishers = (publishers: Publisher[], option: string) => {
    return [...publishers].sort((a, b) => {
      if (option === "a-z") return a.publisherName.localeCompare(b.publisherName);
      if (option === "z-a") return b.publisherName.localeCompare(a.publisherName);
      return 0;
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.publisherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getPublishers();
  }, [showForm]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="bg-gray-700 p-3 text-center text-white font-bold text-lg">
        Publishers
      </h1>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-600 text-white font-medium p-2 px-4 rounded-md flex items-center mt-4 ml-auto transition hover:bg-gray-500"
        >
          <Plus size={18} className="mr-2" /> New Publisher
        </button>
      ) : (
        <AddPublisherForm
          setShowPublisher={setShowForm}
          publisherId={publisherId}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}

      {/* Search Bar */}
      <div className="flex items-center p-2 bg-gray-200 rounded-md mt-4 mb-5 max-w-xs">
        <Search className="text-gray-600" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="ml-2 bg-gray-200 outline-none w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="flex bg-gray-300 max-w-xs rounded-md text-gray-700 items-center p-2 space-x-2 mb-4">
          <label htmlFor="sort" className="text-sm font-medium">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="text-gray-700 border border-gray-400 rounded-md p-1 focus:outline-none focus:ring focus:ring-gray-400"
          >
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>

        {filteredPublishers.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden">
            <thead className="bg-gray-600">
              <tr className="text-white uppercase text-xs tracking-wide">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Place</th>
                <th className="py-3 px-4 text-left">State</th>
                <th className="py-3 px-4 text-left">Country</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Website</th>
                <th className="py-3 px-4 text-left">Established Year</th>
                <th className="py-3 px-4 text-left">Edit</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {sortPublishers(filteredPublishers, sortOption).map((publisher, idx) => (
                <tr
                  key={publisher._id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } border-b border-gray-200 hover:bg-gray-50 transition`}
                >
                  <td className="py-2 px-4 whitespace-nowrap">{publisher.publisherName}</td>
                  <td className="py-2 px-4">{publisher.address?.place}</td>
                  <td className="py-2 px-4">{publisher.address?.state}</td>
                  <td className="py-2 px-4">{publisher.address?.country}</td>
                  <td className="py-2 px-4">{publisher.contact?.email}</td>
                  <td className="py-2 px-4">{publisher.contact?.website}</td>
                  <td className="py-2 px-4">{publisher.establishedYear}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => {
                        setPublisherId(publisher._id);
                        setIsEditing(true);
                        setShowForm(true);
                      }}
                      className="text-gray-600 font-semibold hover:text-gray-800 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-5 text-gray-600">
            No publishers available.
          </p>
        )}
      </div>
    </div>
  );
}

export default Publishers;
