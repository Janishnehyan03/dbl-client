import Axios from "../Axios";

export const fetchPublishers = async () => {
  try {
    const response = await Axios.get("/publishers");
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || err.message);
  }
};
