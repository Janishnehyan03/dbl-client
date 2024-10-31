import { useState, useEffect } from "react";
import Axios from "../../../../utils/Axios";
import toast from "react-hot-toast";
import { Author } from "../../../../utils/types";

interface AuthorPopupProps {
  setShowAuthor: (show: boolean) => void;
  isEditing?: boolean;
  authorId?: string;
  setIsEditing: any;
}

const AuthorPopup: React.FC<AuthorPopupProps> = ({
  setShowAuthor,
  isEditing = false,
  authorId,
  setIsEditing,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Author>({
    firstName: "",
    lastName: "",
    contactNumber: "",
    website: "",
    email: "",
    _id: "",
  });

  // Fetch author details if editing
  useEffect(() => {
    const fetchAuthor = async () => {
      if (isEditing && authorId) {
        setLoading(true);
        try {
          const res = await Axios.get(`/authors/${authorId}`);
          if (res.status === 200) {
            setFormData(res.data); // Populate form with fetched author data
          }
        } catch (error) {
          toast.error("Failed to fetch author details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAuthor();
  }, [isEditing, authorId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = isEditing
        ? await Axios.patch(`/authors/${authorId}`, formData)
        : await Axios.post("/authors", formData);

      if (res.status === (isEditing ? 200 : 201)) {
        toast.success(isEditing ? "Author Updated" : "Author Created");
        setShowAuthor(false);
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Author" : "Create New Author"}
            </h3>
            <button
              type="button"
              onClick={() => setShowAuthor(false)}
              className="text-gray-400 hover:text-gray-900 rounded-lg p-1"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <form onSubmit={createAuthor}>
              {[
                "firstName",
                "lastName",
                "email",
                "contactNumber",
                "website",
              ].map((field) => (
                <div className="mb-4" key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                    {field === "firstName" && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    id={field}
                    name={field}
                    placeholder={`Enter ${field}`}
                    value={
                      formData[field as keyof Author] instanceof Date
                        ? (formData[field as keyof Author] as any)
                            .toISOString()
                            .split("T")[0] // convert Date to string in 'YYYY-MM-DD' format
                        : formData[field as keyof Author] || ""
                    }
                    onChange={handleChange}
                    required={field === "firstName"}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setShowAuthor(false);
                  }}
                  className="text-gray-700 bg-white border border-gray-300 rounded-md px-4 py-2 mr-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.firstName.trim().length === 0}
                  className={`text-white ${
                    loading
                      ? "bg-primary-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  } focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-md text-sm px-5 py-2.5`}
                >
                  {loading ? "Processing..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPopup;
