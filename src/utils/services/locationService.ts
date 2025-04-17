// src/services/locationService.ts
import axios from "../Axios";

export const fetchLocations = async () => {
  try {
    const response = await axios.get("/locations");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch locations");
  }
};

export const createLocation = async (formData: any) => {
  if (!formData.name || !formData.phone) {
    throw new Error("Name and phone are required.");
  }

  try {
    const response = await axios.post("/locations", formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add location");
  }
};

export const updateLocation = async (id: string, formData: any) => {
  if (!formData.name || !formData.phone) {
    throw new Error("Name and phone are required.");
  }

  try {
    const response = await axios.put(`/locations/${id}`, formData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update location"
    );
  }
};

export const deleteLocation = async (id: string) => {
  try {
    await axios.delete(`/locations/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete location"
    );
  }
};
