import { PlusCircle, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Axios from "../../../utils/Axios";

interface PublisherPopupProps {
  setShowPublisher: (show: boolean) => void;
  isEditing?: boolean;
  setIsEditing: any;
  publisherId?: string;
}

const PublisherPopup: React.FC<PublisherPopupProps> = ({
  setShowPublisher,
  isEditing = false,
  publisherId,
  setIsEditing,
}) => {
  const [loading, setLoading] = useState(false);
  const [publisherData, setPublisherData] = useState<any>({
    publisherName: "",
    address: {
      place: "",
      state: "",
      country: "",
    },
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    establishedYear: "",
  });

  // Fetch publisher details if editing
  useEffect(() => {
    const fetchPublisher = async () => {
      if (isEditing && publisherId) {
        setLoading(true);
        try {
          const res = await Axios.get(`/publishers/${publisherId}`);
          if (res.status === 200) {
            setPublisherData(res.data); // Populate form with fetched publisher data
          }
        } catch (error) {
          toast.error("Failed to fetch publisher details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPublisher();
  }, [isEditing, publisherId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setPublisherData((prevData: any) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setPublisherData((prevData: any) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = isEditing
        ? await Axios.patch(`/publishers/${publisherId}`, publisherData)
        : await Axios.post("/publishers", publisherData);

      if (res.status === (isEditing ? 200 : 201)) {
        toast.success(isEditing ? "Publisher Updated" : "Publisher Created");
        setShowPublisher(false);
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-60 transition-opacity duration-300">
      <form
        onSubmit={handleSubmit}
        className="relative p-6 bg-white rounded-lg shadow-lg border border-neutral-200 max-w-3xl mx-auto transform transition-transform duration-300 ease-in-out"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Edit Publisher" : "Add Publisher"}
          </h2>
          <button
            type="button"
            onClick={() => setShowPublisher(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="publisherName"
              value={publisherData.publisherName}
              onChange={handleChange}
              placeholder="Publisher Name"
              className="mt-1 block w-full px-3 py-2 rounded-md  border border-gray-300 shadow-sm   focus:ring-primary-500 sm:text-sm"
            />
          </div>
          {/* Address and Contact Information Inputs */}
          {["place", "state", "country"].map((field) => (
            <div className="mb-4" key={field}>
              <label
                htmlFor={`address.${field}`}
                className="block text-sm font-medium text-gray-700"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                id={`address.${field}`}
                name={`address.${field}`}
                value={publisherData.address[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm   focus:ring-primary-500 sm:text-sm"
              />
            </div>
          ))}
          {["phone", "email", "website"].map((contactField) => (
            <div className="mb-4" key={contactField}>
              <label
                htmlFor={`contact.${contactField}`}
                className="block text-sm font-medium text-gray-700"
              >
                {contactField.charAt(0).toUpperCase() + contactField.slice(1)}
              </label>
              <input
                type={contactField === "email" ? "email" : "text"}
                id={`contact.${contactField}`}
                name={`contact.${contactField}`}
                value={publisherData.contact[contactField]}
                onChange={handleChange}
                placeholder={
                  contactField.charAt(0).toUpperCase() + contactField.slice(1)
                }
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm   focus:ring-primary-500 sm:text-sm"
              />
            </div>
          ))}
          <div className="mb-4">
            <label
              htmlFor="establishedYear"
              className="block text-sm font-medium text-gray-700"
            >
              Established Year
            </label>
            <input
              type="text"
              id="establishedYear"
              name="establishedYear"
              value={publisherData.establishedYear}
              onChange={handleChange}
              placeholder="Established Year"
              className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm   focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600   focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-150"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <PlusCircle className="mr-2" />{" "}
                {isEditing ? "Update Publisher" : "Add Publisher"}
              </>
            )}
          </button>
          <button
            onClick={() => {
              setShowPublisher(false);
              setIsEditing(false)
            }}
            className="ml-4 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-150   focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublisherPopup;
