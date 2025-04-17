import Axios from '../Axios';
import { IClass, IDivision, Section } from "../types";

export const getClasses = async (): Promise<IClass[]> => {
  try {
    const response = await Axios.get('/classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
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

export const getDivisions = async (): Promise<IDivision[]> => {
  try {
    const response = await Axios.get('/divisions');
    return response.data;
  } catch (error) {
    console.error('Error fetching divisions:', error);
    throw error;
  }
};

export const createClass = async (
  classData: Omit<IClass, '_id'>
): Promise<IClass> => {
  try {
    const response = await Axios.post('/classes', classData);
    return response.data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

export const updateClass = async (
  id: string,
  classData: Omit<IClass, '_id'>
): Promise<IClass> => {
  try {
    const response = await Axios.put(`/classes/${id}`, classData);
    return response.data;
  } catch (error) {
    console.error('Error updating class:', error);
    throw error;
  }
};

export const deleteClass = async (id: string): Promise<void> => {
  try {
    await Axios.delete(`/classes/${id}`);
  } catch (error) {
    console.error('Error deleting class:', error);
    throw error;
  }
};