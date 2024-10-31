// AddBook.tsx

import React, { useState } from "react";
import toast from "react-hot-toast";
import Axios from "../../../utils/Axios";
import { useNavigate } from "react-router-dom";

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title) {
      return toast.error("Please enter the title");
    }
    try {
      setLoading(true);
      let response = await Axios.post("/books", { title });
      if (response.status === 201) {
        setLoading(false);
        navigate(`/edit-book/${response.data._id}`);
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error.response);
      toast.error(error.response.data.message || "something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-primary-600">Add New Book</h2>
      <form className="">
        {/* Title */}
        <div className="my-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            onClick={(e) => handleSubmit(e)}
            type="submit"
            disabled={title.length === 0 || loading}
            className={`w-full text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-150 ease-in-out 
  ${
    title.length > 0
      ? "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
      : "bg-gray-400 cursor-not-allowed"
  }`}
          >
            {loading ? "Uploading..." : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
