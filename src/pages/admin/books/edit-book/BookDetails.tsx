// components/BookDetails.tsx

import { useEffect, useState } from "react";
import { ICategory, ILanguage, ILocation } from "../../../../utils/types";
import Axios from "../../../../utils/Axios";

function BookDetails({ formData, handleChange, handleSubmit }: any) {
  const [categories, setCategories] = useState<ICategory[]>();
  const [languages, setLanguages] = useState<ILanguage[]>();
  const [locations, setLocations] = useState<ILocation[]>();
  const getCategories = async () => {
    try {
      let { data } = await Axios.get("/categories");
      setCategories(data);
    } catch (error: any) {
      console.log(error.response);
    }
  };
  const getLocations = async () => {
    try {
      let { data } = await Axios.get("/locations");
      setLocations(data);
    } catch (error: any) {
      console.log(error.response);
    }
  };
  const getLanguages = async () => {
    try {
      let { data } = await Axios.get("/languages");
      setLanguages(data);
    } catch (error: any) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    getCategories();
    getLanguages();
    getLocations();
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Book Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Book Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Book Title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* English Title */}
      <div>
        <label
          htmlFor="englishTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          English Title
        </label>
        <input
          type="text"
          id="englishTitle"
          name="englishTitle"
          value={formData.englishTitle}
          onChange={handleChange}
          placeholder="English Title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label
          htmlFor="englishTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
         ACC Number
        </label>
        <input
          type="text"
          id="accNumber"
          name="accNumber"
          value={formData.accNumber}
          onChange={handleChange}
          placeholder="ACC Number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label
          htmlFor="englishTitle"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
         Call Number
        </label>
        <input
          type="text"
          id="callNumber"
          name="callNumber"
          value={formData.callNumber}
          onChange={handleChange}
          placeholder="Call Number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* ISBN */}
      <div>
        <label
          htmlFor="ISBN"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ISBN
        </label>
        <input
          type="text"
          id="ISBN"
          name="ISBN"
          value={formData.ISBN}
          onChange={handleChange}
          placeholder="ISBN"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Publication Date */}
      <div>
        <label
          htmlFor="publicationDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Publication Date
        </label>
        <input
          type="date"
          id="publicationDate"
          name="publicationDate"
          value={formData.publicationDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Edition */}
      <div>
        <label
          htmlFor="edition"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Edition
        </label>
        <input
          type="text"
          id="edition"
          name="edition"
          value={formData.edition}
          onChange={handleChange}
          placeholder="Edition"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Language */}
      <div>
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Language
        </label>
        <select
          id="language"
          name="language"
          value={formData.language} // Set value to formData.language (which should hold the ID)
          onChange={(e) => {
            handleChange(e); // Make sure to handle the change correctly
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="" disabled>
            Select a language
          </option>
          {/* Placeholder Option */}
          {languages?.map((language) => (
            <option key={language._id} value={language._id}>
              {language.languageName} {/* Display the category name */}
            </option>
          ))}
        </select>
      </div>
      {/* Language */}
      <div>
        <label
          htmlFor="Location"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Location
        </label>
        <select
          id="location"
          name="location"
          value={formData.location} // Set value to formData.location (which should hold the ID)
          onChange={(e) => {
            handleChange(e); // Make sure to handle the change correctly
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="" disabled>
            Select a location
          </option>
          {/* Placeholder Option */}
          {locations?.map((location) => (
            <option key={location._id} value={location._id}>
              {location.locationName} {/* Display the category name */}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category} // Set value to formData.category (which should hold the ID)
          onChange={(e) => {
            handleChange(e); // Make sure to handle the change correctly
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="" disabled>
            Select a category
          </option>
          {/* Placeholder Option */}
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.categoryName} {/* Display the category name */}
            </option>
          ))}
        </select>
      </div>

      {/* Number of Pages */}
      <div>
        <label
          htmlFor="numberOfPages"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Number of Pages
        </label>
        <input
          type="number"
          id="numberOfPages"
          name="numberOfPages"
          value={formData.numberOfPages}
          onChange={handleChange}
          placeholder="Number of Pages"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Published */}
      <div>
        <label
          htmlFor="published"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Published
        </label>
        <select
          id="published"
          name="published"
          value={formData.published}
          onChange={(e) => {
            handleChange(e);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>

      

      {/* Description */}
      <div className="md:col-span-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter book description"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        ></textarea>
      </div>
      <div className="mt-6" onClick={handleSubmit}>
        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Save Book
        </button>
      </div>
    </div>
  );
}

export default BookDetails;
