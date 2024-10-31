import React from "react";
import { useLocation } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const primaryColor = "text-primary-500"; // Tailwind class for your primary color

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${primaryColor} text-white text-center`}
    >
      <h1 className={`text-6xl mb-4 ${primaryColor}`}>404 Error</h1>
      <p className="text-2xl text-black">
        The URL{" "}
        <span className={`font-bold ${primaryColor}`}>{location.pathname}</span>{" "}
        is not found on this website.
      </p>
      <a
        href="/"
        className={`mt-8 px-6 py-3 bg-primary-500 text-white no-underline rounded shadow hover:bg-primary-700 transition`}
      >
        Go Back Home
      </a>
    </div>
  );
};

export default ErrorPage;
