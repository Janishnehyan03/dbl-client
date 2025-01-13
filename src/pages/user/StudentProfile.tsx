import { useEffect, useState } from "react";
import Axios from "../../utils/Axios";
import { useParams } from "react-router-dom";

const StudentProfile = () => {
  const { memberId } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await Axios.get(`/issues/member/${memberId}`);
        setIssues(response.data.issuesWithFines);
        setUser(response.data.user);
        setError("");
        setLoading(false);
      } catch (err) {
        setIssues([]);
        setError("An error occurred. Please try again later.");
        setLoading(false);
      }
    };

    fetchIssues();
  }, [memberId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const totalFine = issues.reduce((acc, issue: any) => acc + issue.fine, 0);

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl shadow-xl space-y-8">
      <h2 className="text-4xl font-bold text-gray-900 border-b-4 border-teal-500 pb-4">
        Student Profile
      </h2>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {user.studentName}
          </h3>
          <p className="text-gray-600 mb-1">{user.admissionNumber}</p>
          <p className="text-gray-600 mb-1">{user.class?.className}</p>
          <p className="text-gray-600 mb-1">{user.section.sectionName}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600 text-lg font-medium">
            Total Books Issued: {issues.length}
          </p>
        </div>
      </div>
      {issues.length === 0 ? (
        <div className="text-gray-700 text-xl">
          No issues found for this member.
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Issued Books
            </h3>
            <div className="text-right text-xl font-bold text-gray-900">
              Total Fine: ₹{totalFine.toFixed(2)}
            </div>
          </div>
          <ul className="divide-y divide-gray-300  rounded-lg shadow-inner">
            {issues.map((issue: any) => (
              <li
                key={issue._id}
                className="py-6 px-8 bg-gray-300 my-2 transition duration-300 ease-in-out rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {issue.book.title}
                    </h3>
                    <p className="text-gray-600 mb-1">{issue.book.author}</p>
                    <p className="text-gray-600 mb-1">
                      Issued on:{" "}
                      {new Date(issue.issuedAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mb-1">
                      Due on: {new Date(issue.returnDate).toLocaleDateString()}
                    </p>
                    {issue.daysLate > 0 && (
                      <p className="text-red-500">
                        Days late: {issue.daysLate}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-lg font-medium">
                      Fine: ₹{issue.fine.toFixed(2)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default StudentProfile;
