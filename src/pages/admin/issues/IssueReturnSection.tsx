import React, { useState } from "react";
import IssueBook from "./IssueBook.tsx";
import ReturnBook from "./ReturnBook.tsx";

const IssueReturnBook: React.FC = () => {
  const [action, setAction] = useState<"issue" | "return">("issue");

  return (
    <div>
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setAction("issue")}
          className={`px-4 py-2 rounded-md font-semibold ${action === "issue" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Issue Book
        </button>
        <button
          onClick={() => setAction("return")}
          className={`px-4 py-2 rounded-md font-semibold ${action === "return" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        >
          Return Book
        </button>
      </div>

      {action === "issue" ? <IssueBook /> : <ReturnBook />}
    </div>
  );
};

export default IssueReturnBook;
