// LoadingSpinner.tsx

import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 border-4 border-solid rounded-full animate-spin border-lime-600 border-t-transparent"></div>
        <div className="absolute w-12 h-12 border-4 border-solid rounded-full animate-spin-slow border-lime-400 border-t-transparent"></div>
        <div className="absolute w-8 h-8 border-4 border-solid rounded-full animate-spin border-lime-200 border-t-transparent"></div>
      </div>
      <span className="ml-4 text-xl font-semibold text-lime-600">
        Loading Library Data...
      </span>
    </div>
  );
};

export default LoadingSpinner;
