// src/pages/LocationsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus } from "lucide-react";
import Axios from "../../utils/Axios";
import LocationTable from "../../components/locations/LocationTable";
import LocationModal from "../../components/locations/LocationModal";
import FeedbackMessage from "../../components/ui/FeedbackMessage";

interface Location {
  _id: string;
  name: string;
  description?: string;
  phone: string;
}

const LocationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await Axios.get("/locations");
      setLocations(response.data);
    } catch (err: any) {
      setError("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ name: "", description: "", phone: "" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (location: Location) => {
    setCurrentLocation(location);
    setFormData({
      name: location.name,
      description: location.description || "",
      phone: location.phone,
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.phone) {
        throw new Error("Name and phone are required.");
      }
      const response = await Axios.post("/locations", formData);
      setLocations((prev) => [...prev, response.data]);
      setSuccess(true);
      setIsAddModalOpen(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add location");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.phone) {
        throw new Error("Name and phone are required.");
      }
      const response = await Axios.put(
        `/locations/${currentLocation?._id}`,
        formData
      );
      setLocations((prev) =>
        prev.map((loc) =>
          loc._id === currentLocation?._id ? response.data : loc
        )
      );
      setSuccess(true);
      setIsEditModalOpen(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      setLoading(true);
      setError(null);
      try {
        await Axios.delete(`/locations/${id}`);
        setLocations((prev) => prev.filter((loc) => loc._id !== id));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete location");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MapPin className="mr-3 text-indigo-600" size={32} />
            Locations
          </h1>
          <div className="space-x-4">
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Add Location
            </button>
            <button
              onClick={() => navigate("/catalog/books")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to Books
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <LocationTable
            locations={locations}
            loading={loading}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>

        {success && (
          <FeedbackMessage
            type="success"
            message="Action completed successfully!"
          />
        )}
        {error && <FeedbackMessage type="error" message={error} />}

        <LocationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
          formData={formData}
          onInputChange={handleInputChange}
          title="Add New Location"
          loading={loading}
        />
        <LocationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          formData={formData}
          onInputChange={handleInputChange}
          title="Edit Location"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LocationsPage;
