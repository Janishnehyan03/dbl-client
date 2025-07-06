import Axios from "../../../../utils/Axios";
import { BellRing, Loader } from "lucide-react";
import { useEffect, useState } from "react";

// Helper to format date as YYYY-MM-DD
const formatDate = (isoString: string) => {
  return new Date(isoString).toISOString().split("T")[0];
};

const OverdueReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getOverdueReminders = async () => {
    try {
      // Simulating an API call to fetch overdue reminders
      const response = await Axios.get("/dashboard/overdue-reminders");
      return response.data;
    } catch (error) {
      // Handle error state if needed
      console.error("Error fetching overdue reminders:", error);
      throw error; // Re-throw to handle in useEffect
    }
  };

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await getOverdueReminders();
        setReminders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReminders();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader className="animate-spin inline-block" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Overdue Reminders
      </h2>
      {reminders.length === 0 ? (
        <p className="text-gray-600">No overdue books. Great job!</p>
      ) : (
        <ul className="space-y-3">
          {reminders.map((reminder: any, index) => (
            <li key={index} className="flex items-start space-x-3">
              <BellRing
                className="text-orange-500 mt-1 flex-shrink-0"
                size={18}
              />
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">
                  {reminder.patronName}
                </span>{" "}
                - <span className="italic">{reminder.bookTitle}</span> (Due:{" "}
                {formatDate(reminder.dueDate)})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OverdueReminders;
