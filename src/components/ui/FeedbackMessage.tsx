import { CheckCircle, AlertCircle, Info } from "lucide-react";

type FeedbackType = "success" | "error" | "info";

interface FeedbackMessageProps {
  type: FeedbackType;
  message: string;
  className?: string;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
  className = "",
}) => {
  const baseClasses = "p-4 border-l-4 rounded-lg flex items-center";
  
  const typeClasses = {
    success: "bg-green-50 border-green-500 text-green-700",
    error: "bg-red-50 border-red-500 text-red-700",
    info: "bg-blue-50 border-blue-500 text-blue-700",
  };

  const icons = {
    success: <CheckCircle className="mr-3 text-green-500" size={20} />,
    error: <AlertCircle className="mr-3 text-red-500" size={20} />,
    info: <Info className="mr-3 text-blue-500" size={20} />,
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {icons[type]}
      <p>{message}</p>
    </div>
  );
};

export default FeedbackMessage;