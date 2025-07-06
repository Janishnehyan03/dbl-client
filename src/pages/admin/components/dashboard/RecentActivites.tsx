import { AlertTriangle, CheckCircle, Loader } from "lucide-react"; // Example icons
import { useEffect, useState } from "react";
import Axios from "../../../../utils/Axios";

// A helper function to format the date in a user-friendly way
const formatTimestamp = (isoString: string) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getRecentActivities = async () => {
    try {
      // Simulating an API call to fetch recent activities
      let response = await Axios.get("/dashboard/recent-activities?limit=6");
      setActivities(response.data);
      return response.data;
    } catch (error) {
      setError("Failed to load recent activities.");
    }
  };

  useEffect(() => {
    // Define an async function inside useEffect to fetch the data
    const fetchActivities = async () => {
      try {
        const dataFromApi = await getRecentActivities();

        // **Data Transformation**
        // Map the API data to the structure your component expects.
        const formattedActivities = dataFromApi.map(
          (activity: any, index: number) => ({
            id: index, // Use index as key since API doesn't provide a unique ID for the activity item
            action: activity.type, // API `type` maps to component `action`
            details: activity.description, // API `description` maps to component `details`
            timestamp: formatTimestamp(activity.timestamp),
          })
        );

        setActivities(formattedActivities);
      } catch (err) {
        setError("Failed to load recent activities.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []); // The empty dependency array [] ensures this runs only once on mount

  // Render a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-lg">
        <Loader className="animate-spin text-gray-500" size={24} />
        <p className="ml-3 text-gray-600">Loading Activities...</p>
      </div>
    );
  }

  // Render an error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50 rounded-xl shadow-lg">
        <AlertTriangle className="text-red-500" size={24} />
        <p className="ml-3 text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  // Render the main content
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recent Activities
      </h2>
      {activities.length === 0 ? (
        <p className="text-gray-600">No recent activities to display.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity: any) => (
            <li key={activity._id} className="flex items-start space-x-3">
              <CheckCircle
                className="text-green-500 mt-1 flex-shrink-0"
                size={20}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-600">{activity.details}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivities;
