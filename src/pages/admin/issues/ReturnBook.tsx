import React, { useState } from "react";
import Axios from "../../../utils/Axios";
import toast from "react-hot-toast";
import FinePopup from "./Finepopup";

const ReturnBook: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [member, setMember] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);

  const fetchMemberIssues = async (memberId: string) => {
    try {
      const response = await Axios.get(`/issues/member/${memberId}`);
      setIssues(response.data);
    } catch (error: any) {
      console.error("Error fetching member issues:", error.response);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReturn = (issue: any) => {
    if (issue.fine > 0) {
      setSelectedIssue(issue);
      setShowModal(true);
    } else {
      processReturn(issue._id, 0); // No fine to pay
    }
  };

  const processReturn = async (issueId: string, paidAmount: number) => {
    try {
      const response = await Axios.patch(`/issues/${issueId}/return`, {
        paidAmount,
      });
      toast.success(response.data.message);
      setIssues(issues.filter((issue) => issue._id !== issueId)); // Update the issue list
      setSelectedIssue(null);
      setShowModal(false);
    } catch (error: any) {
      console.log(error.response);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const fetchMember = async () => {
    try {
      const response = await Axios.get(
        `/members?admissionNumber=${identifier}`
      );
      const members = response.data;
      if (members.length > 0) {
        setMember(members[0]);
        await fetchMemberIssues(members[0]._id);
      } else {
        toast.error("No member found.");
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      toast.error("Error fetching member.");
    }
  };

  // New function to handle renew action
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

  return (
    <div className="max-w-lg mx-auto p-8 bg-red-100 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Return a Book
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admission Number
        </label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring focus:ring-red-400 focus:border-red-500 w-full"
          placeholder="Enter admission number"
        />
      </div>

      <button
        onClick={fetchMember}
        className="w-full bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition duration-200"
      >
        Fetch Member
      </button>

      {member && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Member Details
          </h3>
          <div className="bg-white p-4 rounded-md shadow">
            <p>{member.studentName}</p>
            <p>{member.admissionNumber}</p>
            <p>{member.class?.className}</p>
          </div>

          {issues.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Issued Books
              </h4>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {issues.map((issue) => (
                  <div
                    key={issue._id}
                    className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200"
                  >
                    <div>
                      <p className="text-xl font-semibold text-gray-800 mb-1">
                        {issue.book.title}
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
                            <span className="text-red-500">₹{issue.fine}</span>
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="bg-gray-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-gray-700 shadow transition duration-300 transform hover:scale-105"
                        onClick={() => handleReturn(issue)}
                      >
                        Return
                      </button>
                      <button
                        className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition duration-300"
                        onClick={() => handleRenew(issue._id)}
                      >
                        Renew
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for fine confirmation */}
      <FinePopup
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={(paidAmount) =>
          processReturn(selectedIssue?._id, paidAmount)
        }
        fineAmount={selectedIssue?.fine || 0}
      />
    </div>
  );
};

export default ReturnBook;
