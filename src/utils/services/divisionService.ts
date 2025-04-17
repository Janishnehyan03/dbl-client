import Axios from '../Axios';
import { IDivision } from '../../utils/types';

export const getDivisions = async (): Promise<IDivision[]> => {
  try {
    const response = await Axios.get('/divisions');
    return response.data;
  } catch (error) {
    console.error('Error fetching divisions:', error);
    throw error;
  }
};

export const createDivision = async (divisionData: Omit<IDivision, '_id'>): Promise<IDivision> => {
  try {
    const response = await Axios.post('/divisions', divisionData);
    return response.data;
  } catch (error) {
    console.error('Error creating division:', error);
    throw error;
  }
};

export const updateDivision = async (id: string, divisionData: Omit<IDivision, '_id'>): Promise<IDivision> => {
  try {
    const response = await Axios.put(`/divisions/${id}`, divisionData);
    return response.data;
  } catch (error) {
    console.error('Error updating division:', error);
    throw error;
  }
};

export const deleteDivision = async (id: string): Promise<void> => {
  try {
    await Axios.delete(`/divisions/${id}`);
  } catch (error) {
    console.error('Error deleting division:', error);
    throw error;
  }
};