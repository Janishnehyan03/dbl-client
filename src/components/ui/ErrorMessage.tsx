import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
    <AlertTriangle className="text-red-500 mr-3" size={20} />
    <p className="text-red-700">{message}</p>
  </div>
);

export default ErrorMessage;
