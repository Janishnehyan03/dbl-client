import Axios from "../Axios";

export const fetchAuthors = async () => {
  try {
    const response = await Axios.get("/authors");
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const createAuthor = async (data: any) => {
  try {
    const response = await Axios.post("/authors", data);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
