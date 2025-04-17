import Axios from "../Axios";

export const fetchCategories = async () => {
  try {
    const response = await Axios.get("/categories");
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const createCategory = async (name: string, description: string) => {
  try {
    const response = await Axios.post("/categories", { name, description });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
