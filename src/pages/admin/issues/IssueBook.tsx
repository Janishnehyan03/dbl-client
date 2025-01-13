import React, { useEffect, useState } from "react";
import Axios from "../../../utils/Axios";
import toast from "react-hot-toast";
import { Search } from "lucide-react"; // Import the Search icon from lucide-react
import { BiPlus } from "react-icons/bi";

const IssueBook: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [member, setMember] = useState<any>(null);
  const [accNumber, setAccNumber] = useState("");
  const [showBookSection, setShowBookSection] = useState(false);
  const [issues, setIssues] = useState<any[]>([]);

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

  const fetchMemberIssues = async (memberId: string) => {
    try {
      const response = await Axios.get(`/issues/member/${memberId}`);
      setIssues(response.data);
    } catch (error: any) {
      console.error("Error fetching member issues:", error.response);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const issueBook = async () => {
    try {
      await Axios.post("/issues", {
        accNumber,
        member: member?._id,
      });
      toast.success("Book issued successfully!");
      // Reset state
      fetchMemberIssues(member?._id);
      setAccNumber("")
    } catch (error: any) {
      console.error("Error issuing book:", error.response);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  const handleRenew = async (issueId: string) => {
    try {
      const response = await Axios.patch(`/issues/${issueId}/renew`);
      toast.success(response.data.message);
      // Update the issues list to reflect the new return date
      fetchMemberIssues(response.data.issue.member);
    } catch (error: any) {
      console.error("Error renewing issue:", error.response);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const checkRenewalEligibility = (issue: any) => {
    const currentDate = new Date();
    const issuedAt = new Date(issue.issuedAt);
    const returnDate = new Date(issue.returnDate);

    // Calculate the duration in days between issuedAt and returnDate
    const durationInDays = Math.floor(
      (returnDate.getTime() - issuedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine if the renewal can proceed
    const isOverdue = currentDate > returnDate;
    const hasRenewed = durationInDays >= 7;

    return { isOverdue, hasRenewed };
  };

  useEffect(() => {
    if (member?._id) {
      fetchMemberIssues(member._id);
    }
  }, [member]);

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
          onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
          className="px-3 py-2 border border-green-400 rounded-l-md focus:ring focus:ring-green-300 focus:border-green-500"
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
          {issues.length > 0 && (
            <div className="my-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Issued Books
              </h4>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {issues.map((issue) => {
                  const { isOverdue, hasRenewed } =
                    checkRenewalEligibility(issue);

                  return (
                    <div
                      key={issue._id}
                      className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200"
                    >
                      <div>
                        <p className="text-xl font-semibold text-gray-800 mb-1">
                          {issue.book.title}
                        </p>
                        <p className=" text-gray-800 mb-1">
                          Acc Number {issue.book.accNumber}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-semibold">Issue Date:</span>{" "}
                          <span className="italic">
                            {new Date(issue.issuedAt).toLocaleDateString()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-semibold">Return Date:</span>{" "}
                          <span className="italic">
                            {new Date(issue.returnDate).toLocaleDateString()}
                          </span>
                        </p>
                        {issue.fine > 0 && (
                          <>
                            <p className="text-sm text-gray-500 italic mb-1">
                              Days Late:{" "}
                              <span className="text-red-500">
                                {issue.daysLate}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500 italic">
                              Fine:{" "}
                              <span className="text-red-500">
                                ₹{issue.fine}
                              </span>
                            </p>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className={`bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition duration-300 ${
                            isOverdue || hasRenewed
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            !isOverdue && !hasRenewed && handleRenew(issue._id)
                          }
                          disabled={isOverdue || hasRenewed}
                        >
                          Renew
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
              className="px-3 py-2 border border-green-400 rounded-l-md focus:ring focus:ring-green-300 focus:border-green-500"
              placeholder="Enter accession number"
            />

            <button
              onClick={issueBook}
              className="flex items-center justify-center ml-1 bg-green-600 text-white px-3 py-3 rounded-r-md font-semibold hover:bg-green-700 transition duration-200"
              style={{ height: "100%" }} // Ensures the button height matches the input
            >
              <BiPlus className="mr-2 h-5 w-5" /> Issue Book
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueBook;
