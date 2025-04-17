import Axios from "../Axios";
import { BookFormData } from "../types";

export const fetchBooks = async () => {
  const response = await Axios.get(`/books`);
  return response.data;
};

export const createBook = async (bookData: any) => {
  try {
    const response = await Axios.post(`/books`, bookData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getBook = async (id: string) => {
  const response = await Axios.get(`/books/${id}`);
  return response.data;
};


export const updateBook = async (id: string, bookData: BookFormData) => {
  try {
    const response = await Axios.patch(`/books/${id}`, bookData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
