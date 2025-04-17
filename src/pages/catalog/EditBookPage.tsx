import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../components/book-form/FormInput";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import MultiSelect from "../../components/ui/MultiSelector";
import SingleSelect from "../../components/ui/SingleSelect";
import { fetchAuthors } from "../../utils/services/authorService";
import { getBook, updateBook } from "../../utils/services/bookService";
import { fetchCategories } from "../../utils/services/categoryService";
import { fetchPublishers } from "../../utils/services/publisherService";
import { Author, ICategory } from "../../utils/types";
import { fetchLanguages } from "../../utils/services/languageService";
import { fetchLocations } from "../../utils/services/locationService";
import Checkbox from "../../components/ui/CheckBox";

const EditBookForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formMode, setFormMode] = useState<"quick" | "full">("quick");
  const [formData, setFormData] = useState<any>({
    title: "",
    accNumber: "",
    callNumber: "",
    authors: [],
    isbn: "",
    publisher: null,
    publishedDate: "",
    categories: [],
    location: null,
    edition: "",
    price: "",
    status: "",
    published: false,
    isNewArrival: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState([]); // Assuming publishers are fetched from somewhere
  const [locations, setLocations] = useState([]); // Assuming locations are fetched from somewhere
  const [languages, setLanguages] = useState([]); // Assuming languages are fetched from somewhere

  useEffect(() => {
    const fetchBookAndData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [
          bookData,
          authorsData,
          categoriesData,
          publishersData,
          locationsData,
          languagesData,
        ] = await Promise.all([
          getBook(id),
          fetchAuthors(),
          fetchCategories(),
          fetchPublishers(), // Assuming you have a function to fetch publishers
          fetchLocations(), // Assuming you have a function to fetch locations
          fetchLanguages(), // Assuming you have a function to fetch languages
        ]);
        if (!bookData) throw new Error("Book not found");

        setCategories(categoriesData);
        setFormData({
          title: bookData.title,
          accNumber: bookData.accNumber,
          callNumber: bookData.callNumber,
          authors: bookData.authors,
          isbn: bookData.isbn,
          publisher: bookData.publisher,
          publishedDate: bookData.publishedDate,
          categories: bookData.categories,
          location: bookData.location,
          language: bookData.language,
          edition: bookData.edition,
          price: bookData.price,
          status: bookData.status,
          published: bookData.published,
          isNewArrival: bookData.isNewArrival,
        });
        setAuthors(authorsData);
        setCategories(categoriesData);
        setPublishers(publishersData); // Assuming you have a function to fetch publishers
        setLocations(locationsData); // Assuming you have a function to fetch locations
        setLanguages(languagesData); // Assuming you have a function to fetch languages
      } catch (err) {
        setError("Failed to load book data");
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndData();
  }, [id]);

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
      if (!formData.title || !formData.accNumber || !formData.callNumber) {
        throw new Error(
          "Title, Accession Number, and Call Number are required"
        );
      }

      if (!id) throw new Error("Book ID is missing");

      const submissionData = {
        ...formData,
        publisher: formData.publisher?._id || null,
        authors: formData.authors?.map((author: Author) => author._id) || [],
        categories: formData.categories?.map((cat: ICategory) => cat._id) || [],
      };

      await updateBook(id, submissionData);
      navigate("/catalog/books", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.title) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
        <button
          type="button"
          onClick={toggleFormMode}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {formMode === "quick"
            ? "Switch to Full Edit"
            : "Switch to Quick Edit"}
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
                <option value="checked_out">Checked Out</option>
                <option value="damaged">Damaged</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <Checkbox
              label={"Published?"}
              checked={formData.published || false}
              onChange={(checked: boolean) => {
                setFormData((prev: any) => ({ ...prev, published: checked }));
              }}
              disabled={false}
              indeterminate={false}
            />
            <Checkbox
              label={"New Arrival?"}
              checked={formData.isNewArrival || false}
              onChange={(checked: boolean) => {
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
            {formMode === "quick" ? "Edit More Details" : "Show Less"}
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
                Updating Book...
              </>
            ) : formMode === "quick" ? (
              "Quick Update"
            ) : (
              "Full Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;
