import React, { useState } from "react";
import Axios from "../../../utils/Axios";
import toast from "react-hot-toast";
import { Search } from "lucide-react"; // Import the Search icon from lucide-react

const IssueBook: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [member, setMember] = useState<any>(null);
  const [accNumber, setAccNumber] = useState("");
  const [book, setBook] = useState<any>(null);
  const [showBookSection, setShowBookSection] = useState(false);

  const fetchMember = async () => {
    try {
      const response = await Axios.get(
        `/members?admissionNumber=${identifier}`
      );
      const members = response.data;
      if (members.length > 0) {
        setMember(members[0]);
        setShowBookSection(true);
      } else {
        toast.error("No member found");
      }
    } catch (error: any) {
      console.error("Error fetching member:", error.response);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  const fetchBook = async () => {
    try {
      const response = await Axios.get(`/books?accNumber=${accNumber}`);
      const books = response.data;
      if (books.length > 0) {
        setBook(books[0]);
      } else {
        toast.error("No book found.");
      }
    } catch (error: any) {
      console.error("Error fetching book:", error.response);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  const issueBook = async () => {
    try {
      await Axios.post("/issues", {
        book: book._id,
        member: member._id,
      });
      toast.success("Book issued successfully!");
      // Reset state
      setMember(null);
      setBook(null);
      setAccNumber("");
      setIdentifier("");
      setShowBookSection(false);
    } catch (error: any) {
      console.error("Error issuing book:", error.response);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-200 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-green-900 mb-6">
        Issue a Book
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-green-600 mb-2">
          Admission Number
        </label>
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="px-3 py-2 border border-green-400 rounded-l-md focus:ring focus:ring-green-300 focus:border-green-500 "
          placeholder="Enter admission number"
        />

        <button
          onClick={fetchMember}
          className="flex items-center justify-center ml-1 bg-green-600 text-white px-3 py-3 rounded-r-md font-semibold hover:bg-green-700 transition duration-200"
          style={{ height: "100%" }} // Ensures the button height matches the input
        >
          <Search className="mr-2 h-5 w-5" /> Search Member
        </button>
      </div>

      {showBookSection && member && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-600 mb-4">
            Member Details
          </h3>
          <div className="bg-white p-4 rounded-md shadow">
            <p className="font-semibold">{member.studentName}</p>
            <p>{member.admissionNumber}</p>
            <p className="italic text-sm">{member.class.className}</p>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-green-600 mb-2">
              Accession Number
            </label>
          </div>
          <div className="flex mb-4">
            <input
              type="text"
              value={accNumber}
              onChange={(e) => setAccNumber(e.target.value)}
              className="px-3 py-2 border border-green-400 rounded-l-md focus:ring focus:ring-green-300 focus:border-green-500 "
              placeholder="Enter accession number"
            />

            <button
              onClick={fetchBook}
              className="flex items-center justify-center ml-1 bg-green-600 text-white px-3 py-3 rounded-r-md font-semibold hover:bg-green-700 transition duration-200"
              style={{ height: "100%" }} // Ensures the button height matches the input
            >
              <Search className="mr-2 h-5 w-5" /> Search Book
            </button>
          </div>

          {book && (
            <div className="mt-6 bg-white p-4 rounded-md shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {book.title}
              </h4>

              <p>Acc No: {book.accNumber}</p>
              <p>Call No: {book?.callNumber}</p>

              <button
                onClick={issueBook}
                className="mt-4 w-full bg-gray-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-900 transition duration-200"
              >
                Issue Book
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueBook;
