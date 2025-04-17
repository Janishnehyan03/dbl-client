import Axios from "../Axios";
import { Role11 } from "../../utils/types";

export const getRoles = async (): Promise<Role11[]> => {
  try {
    const response = await Axios.get("/roles");
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const createRole = async (
  roleData: Omit<Role11, "_id">
): Promise<Role11> => {
  try {
    const response = await Axios.post("/roles", roleData);
    return response.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

export const updateRole = async (
  id: string,
  roleData: Omit<Role11, "_id">
): Promise<Role11> => {
  try {
    const response = await Axios.put(`/roles/${id}`, roleData);
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    await Axios.delete(`/roles/${id}`);
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};
