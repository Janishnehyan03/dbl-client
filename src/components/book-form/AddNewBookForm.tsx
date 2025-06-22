import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthors } from "../../utils/services/authorService";
import { createBook } from "../../utils/services/bookService";
import { fetchCategories } from "../../utils/services/categoryService";
import { fetchLanguages } from "../../utils/services/languageService";
import { fetchLocations } from "../../utils/services/locationService";
import { fetchPublishers } from "../../utils/services/publisherService";
import { Author, ICategory } from "../../utils/types";
import Checkbox from "../ui/CheckBox";
import LoadingSpinner from "../ui/LoadingSpinner";
import MultiSelect from "../ui/MultiSelector";
import SingleSelect from "../ui/SingleSelect";
import FormInput from "./FormInput";

const AddNewBookForm: React.FC = () => {
  const navigate = useNavigate();
  const [formMode, setFormMode] = useState<"quick" | "full">("quick");
  const [formData, setFormData] = useState<any>({
    title: "",
    accNumber: "",
    callNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const toggleFormMode = () => {
    setFormMode(formMode === "quick" ? "full" : "quick");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.title || !formData.accNumber || !formData.callNumber) {
        throw new Error(
          "Title, Accession Number, and Call Number are required"
        );
      }

      // Create the book
      const newBook = await createBook(formData);

      // Navigate to edit page with the new book ID
      navigate(`/books/edit/${newBook._id}`, {
        state: { message: "Book created successfully" },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAuthorsAndCategories = async () => {
      try {
        const [
          authorsData,
          categoriesData,
          publishersData,
          locationsData,
          languagesData,
        ] = await Promise.all([
          fetchAuthors(),
          fetchCategories(),
          fetchPublishers(),
          fetchLocations(),
          fetchLanguages(),
        ]);
        setAuthors(authorsData);
        setCategories(categoriesData);
        setPublishers(publishersData);
        setLocations(locationsData);
        setLanguages(languagesData);
      } catch (err) {
        console.error("Failed to fetch authors and categories:", err);
      }
    };

    fetchAuthorsAndCategories();
  }, []);
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
        <button
          type="button"
          onClick={toggleFormMode}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {formMode === "quick" ? "Switch to Full Add" : "Switch to Quick Add"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="col-span-2">
          <FormInput
            label="Book Title"
            name="title"
            type="text"
            value={formData.title}
            placeholder="Enter book title"
            onChange={handleChange}
            required
          />
        </div>

        <FormInput
          label="Accession Number"
          name="accNumber"
          type="text"
          value={formData.accNumber || ""}
          placeholder="Enter accession number"
          onChange={handleChange}
          required
        />

        <FormInput
          label="Call Number"
          name="callNumber"
          type="text"
          value={formData.callNumber || ""}
          placeholder="Enter call number"
          onChange={handleChange}
          required
        />

        <SingleSelect
          items={publishers}
          selectedItem={formData.publisher || null}
          onSelectionChange={(value) =>
            setFormData((prev: any) => ({ ...prev, publisher: value }))
          }
          label="Publisher"
          placeholder="Choose a publisher..."
          searchPlaceholder="Search publishers..."
          itemLabelKey="name"
          itemValueKey="id"
          clearable={true}
        />

        <FormInput
          label="Publication Date"
          name="publishedDate"
          type="date"
          value={formData.publishedDate || ""}
          onChange={handleChange}
        />

        <MultiSelect
          items={authors}
          selectedItems={formData.authors || []}
          onSelectionChange={(values) =>
            setFormData((prev: any) => ({ ...prev, authors: values }))
          }
          label="Authors"
          placeholder="Select authors..."
          itemLabelKey="name"
          itemValueKey="_id"
        />

        <MultiSelect
          items={categories}
          selectedItems={formData.categories || []}
          onSelectionChange={(values) =>
            setFormData((prev: any) => ({ ...prev, categories: values }))
          }
          label="Categories"
          placeholder="Select categories..."
          itemLabelKey="name"
          itemValueKey="_id"
        />

        {formMode === "full" && (
          <>
            <SingleSelect
              items={languages}
              selectedItem={formData.language || null}
              onSelectionChange={(value) =>
                setFormData((prev: any) => ({ ...prev, language: value }))
              }
              label="Language"
              placeholder="Select a language..."
              searchPlaceholder="Search languages..."
              itemLabelKey="name"
              itemValueKey="_id"
              clearable={true}
            />

            <SingleSelect
              items={locations}
              selectedItem={formData.location || null}
              onSelectionChange={(value) =>
                setFormData((prev: any) => ({ ...prev, location: value }))
              }
              label="Location"
              placeholder="Select a location..."
              searchPlaceholder="Search locations..."
              itemLabelKey="name"
              itemValueKey="_id"
              clearable={true}
            />

            <FormInput
              label="ISBN"
              name="isbn"
              type="text"
              value={formData.isbn || ""}
              placeholder="Enter ISBN"
              onChange={handleChange}
            />

            <FormInput
              label="Price"
              name="price"
              type="number"
              value={formData.price || ""}
              placeholder="Enter price"
              onChange={handleChange}
            />

            <FormInput
              label="Edition"
              name="edition"
              type="text"
              value={formData.edition || ""}
              placeholder="Enter edition"
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-3 bg-white border"
              >
                <option hidden>Select status</option>
                <option value="available">Available</option>
                <option value="issued">issued</option>
                <option value="damaged">Damaged</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <Checkbox
              label="Published?"
              checked={formData.published || false}
              onChange={(checked) => {
                setFormData((prev: any) => ({ ...prev, published: checked }));
              }}
              disabled={false}
              indeterminate={false}
            />

            <Checkbox
              label="New Arrival?"
              checked={formData.isNewArrival || false}
              onChange={(checked) => {
                setFormData((prev: any) => ({
                  ...prev,
                  isNewArrival: checked,
                }));
              }}
              disabled={false}
              indeterminate={false}
            />
          </>
        )}

        <div className="col-span-2 flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={toggleFormMode}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-md transition-colors"
          >
            {formMode === "quick" ? "Add More Details" : "Show Less"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all flex items-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2 h-5 w-5" />
                {formMode === "quick"
                  ? "Creating Book..."
                  : "Creating Book with Full Details..."}
              </>
            ) : formMode === "quick" ? (
              "Quick Add"
            ) : (
              "Full Add"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBookForm;
