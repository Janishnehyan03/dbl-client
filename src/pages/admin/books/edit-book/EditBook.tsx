import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Axios from "../../../../utils/Axios";
import BookDetails from "./BookDetails";
import AuthorInput from "./AuthorInput";
import AuthorPopup from "../components/AuthorPopup";
import PublisherInput from "./PublisherInput";
import AddPublisherForm from "../../publisher/PublisherPopUp";

function EditBook() {
  const { bookId } = useParams();
  const [activeSection, setActiveSection] = useState("BookDetails");
  const [showAuthor, setShowAuthor] = useState(false);
  const [showPublisher, setShowPublisher] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    englishTitle: "",
    accNumber: "",
    authors: [],
    ISBN: "",
    publishers: [],
    publicationDate: "",
    edition: "",
    language: "",
    category: "",
    description: "",
    numberOfPages: "",
    price: "",
    availability: "",
    location: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await Axios.patch(`/books/${bookId}`, formData);
      toast.success("Book edited successfully");
    } catch (error: any) {
      console.error(error.response);
      toast.error("Something went wrong");
    }
  };

  const getBook = async () => {
    try {
      let { data } = await Axios.get(`/books/${bookId}`);
      setFormData(data);
    } catch (error: any) {
      console.error(error.response);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getBook();
  }, [bookId]);

  return (
    <>
      {showAuthor && (
        <AuthorPopup
          setShowAuthor={setShowAuthor}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
      {showPublisher && (
        <AddPublisherForm
          setShowPublisher={setShowPublisher}
          setIsEditing={setIsEditing}
        />
      )}
      <h1 className="text-left text-2xl font-bold my-3">{formData.title}</h1>
      <div className="mb-4">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveSection("BookDetails")}
            className={`py-2 px-4 rounded ${
              activeSection === "BookDetails"
                ? "bg-primary-500 text-white"
                : "text-primary-500"
            }`}
          >
            Book Details
          </button>
          <button
            onClick={() => setActiveSection("AuthorDetails")}
            className={`py-2 px-4 rounded ${
              activeSection === "AuthorDetails"
                ? "bg-primary-500 text-white"
                : "text-primary-500"
            }`}
          >
            Author
          </button>
          <button
            onClick={() => setActiveSection("PublisherDetails")}
            className={`py-2 px-4 rounded ${
              activeSection === "PublisherDetails"
                ? "bg-primary-500 text-white"
                : "text-primary-500"
            }`}
          >
            Publisher
          </button>
        </nav>
      </div>

      <form>
        {activeSection === "BookDetails" && (
          <BookDetails
            handleSubmit={handleSubmit}
            formData={formData}
            handleChange={handleChange}
          />
        )}
        {activeSection === "AuthorDetails" && (
          <AuthorInput
            bookId={bookId}
            setFormData={setFormData}
            authors={formData.authors}
            getBook={getBook}
          />
        )}
        {activeSection === "PublisherDetails" && (
          <PublisherInput
            publishers={formData.publishers}
            setFormData={setFormData}
            bookId={bookId}
            getBook={getBook}
          />
        )}
      </form>
    </>
  );
}

export default EditBook;
