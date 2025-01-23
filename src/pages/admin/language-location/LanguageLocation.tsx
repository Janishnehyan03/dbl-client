import { useEffect, useState } from "react";
import Axios from "../../../utils/Axios"; // Adjust the import path as needed

const LanguageLocationPage = () => {
  // States for Language
  const [languages, setLanguages] = useState([]);
  const [languageName, setLanguageName] = useState("");
  const [editingLanguageId, setEditingLanguageId] = useState(null);

  // States for Location
  const [locations, setLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [editingLocationId, setEditingLocationId] = useState(null);

  // Fetch Languages
  const fetchLanguages = async () => {
    try {
      const { data } = await Axios.get("/languages");
      setLanguages(data);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  // Fetch Locations
  const fetchLocations = async () => {
    try {
      const { data } = await Axios.get("/locations");
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Create or Update Language
  const handleLanguageSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingLanguageId) {
        await Axios.put(`/languages/${editingLanguageId}`, { languageName });
      } else {
        await Axios.post("/languages", { languageName });
      }
      setLanguageName("");
      setEditingLanguageId(null);
      fetchLanguages();
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  // Create or Update Location
  const handleLocationSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingLocationId) {
        await Axios.put(`/locations/${editingLocationId}`, { locationName });
      } else {
        await Axios.post("/locations", { locationName });
      }
      setLocationName("");
      setEditingLocationId(null);
      fetchLocations();
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  // Edit Language
  const editLanguage = (language: any) => {
    setLanguageName(language.languageName);
    setEditingLanguageId(language._id);
  };

  // Edit Location
  const editLocation = (location: any) => {
    setLocationName(location.locationName);
    setEditingLocationId(location._id);
  };

  // Delete Language
  const deleteLanguage = async (id: any) => {
    try {
      await Axios.delete(`/languages/${id}`);
      fetchLanguages();
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  // Delete Location
  const deleteLocation = async (id: any) => {
    try {
      await Axios.delete(`/locations/${id}`);
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  useEffect(() => {
    fetchLanguages();
    fetchLocations();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 bg-gray-50 rounded-lg shadow-lg min-h-screen">
      {/* Languages Section */}
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-gray-700 text-lg font-semibold mb-4">Languages</h2>
        <form onSubmit={handleLanguageSubmit} className="mb-4">
          <input
            type="text"
            value={languageName}
            onChange={(e) => setLanguageName(e.target.value)}
            placeholder="Language Name"
            required
            className="border border-gray-300 p-2 rounded-md w-full mb-2"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 transition"
          >
            {editingLanguageId ? "Update Language" : "Add Language"}
          </button>
        </form>

        <table className="min-w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <thead className="bg-gray-700 text-white text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Language Name</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {languages.map((language: any) => (
              <tr
                key={language._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-3 px-6">{language.languageName}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => editLanguage(language)}
                    className="text-gray-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLanguage(language._id)}
                    className="text-red-600 underline ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Locations Section */}
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-gray-700 text-lg font-semibold mb-4">Locations</h2>
        <form onSubmit={handleLocationSubmit} className="mb-4">
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Location Name"
            required
            className="border border-gray-300 p-2 rounded-md w-full mb-2"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700 transition"
          >
            {editingLocationId ? "Update Location" : "Add Location"}
          </button>
        </form>

        <table className="min-w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <thead className="bg-gray-700 text-white text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Location Name</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {locations.map((location: any) => (
              <tr
                key={location._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-3 px-6">{location.locationName}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => editLocation(location)}
                    className="text-gray-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLocation(location._id)}
                    className="text-red-600 underline ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LanguageLocationPage;
