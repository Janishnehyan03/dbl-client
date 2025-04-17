import Axios from "../Axios";
import { IDepartment, Section } from '../types'

export const getDepartments = async (): Promise<IDepartment[]> => {
  try {
    const response = await Axios.get('/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const getSections = async (): Promise<Section[]> => {
  try {
    const response = await Axios.get('/sections');
    return response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
};

export const createDepartment = async (
  departmentData: Omit<IDepartment, '_id'>
): Promise<IDepartment> => {
  try {
    const response = await Axios.post('/departments', departmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

export const updateDepartment = async (
  id: string,
  departmentData: Omit<IDepartment, '_id'>
): Promise<IDepartment> => {
  try {
    const response = await Axios.put(`/departments/${id}`, departmentData);
    return response.data;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    await Axios.delete(`/departments/${id}`);
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};