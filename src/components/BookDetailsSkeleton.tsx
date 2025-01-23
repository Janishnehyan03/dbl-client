const BookDetailsSkeleton = () => {
    return (
      <div className="container mx-auto p-8 max-w-6xl bg-white shadow-lg rounded-lg animate-pulse">
        <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
  
          <div className="space-y-6">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
  
        <div className="mt-10 space-y-6">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          <div className="flex flex-wrap gap-3">
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        </div>
  
        <div className="bg-gray-100 p-8 rounded-lg shadow-md mt-10">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default BookDetailsSkeleton;
  