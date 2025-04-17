import Axios from "../Axios";

export const fetchPatrons = async () => {
  try {
    const { data } = await Axios.get("/patrons");
    return data; // Ensure the 'data' variable is used
  } catch (error: any) {
    console.error("Error fetching patrons:", error.response);
  }
};
