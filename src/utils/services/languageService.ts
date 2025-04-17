// services/api/languageService.ts
import axios, { AxiosError } from "axios";
import { ILanguage } from "../types";
import Axios from "../Axios";

// Type for language form data
export interface LanguageFormData {
  name: string;
  code: string;
}

// Fetch all languages
export const fetchLanguages = async () => {
  try {
    const response = await Axios.get(`/languages`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Add a new language
export const addLanguage = async (
  formData: LanguageFormData
): Promise<ILanguage> => {
  validateLanguageData(formData);

  try {
    const payload = {
      ...formData,
      code: formData.code.toUpperCase(),
    };
    const response = await Axios.post<ILanguage>(`/languages`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Update an existing language
export const updateLanguage = async (
  id: string,
  formData: LanguageFormData
): Promise<ILanguage> => {
  validateLanguageData(formData);

  try {
    const payload = {
      ...formData,
      code: formData.code.toUpperCase(),
    };
    const response = await Axios.patch<ILanguage>(`/languages/${id}`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Delete a language
export const deleteLanguage = async (id: string): Promise<void> => {
  try {
    await Axios.delete(`/languages/${id}`);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Validation helper
const validateLanguageData = (formData: LanguageFormData): void => {
  if (!formData.name) {
    throw new Error("Language name is required.");
  }
  if (!formData.code) {
    throw new Error("Language code is required.");
  }
  if (formData.code.length !== 2) {
    throw new Error("Language code must be exactly 2 characters (e.g., EN).");
  }
};

// Error handling helper
const handleApiError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "API request failed";
    throw new Error(errorMessage);
  }
  throw new Error("An unexpected error occurred");
};
