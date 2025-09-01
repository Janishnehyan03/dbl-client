import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface FeedbackMessageProps {
  success: boolean;
  message: string | null;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  success,
  message,
}) => {
  if (success) {
    return (
      <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center mb-4">
        <CheckCircle className="text-green-500 mr-3" size={20} />
        <p className="text-green-700">Action completed successfully!</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center mb-4">
        <AlertCircle className="text-red-500 mr-3" size={20} />
        <p className="text-red-700">{message}</p>
      </div>
    );
  }

  return null;
};

export default FeedbackMessage;
