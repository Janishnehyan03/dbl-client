
const BookSkeleton = () => {
  return (
    <div className="max-w-sm overflow-hidden animate-pulse">
      {/* Skeleton for Book Cover */}
      <div className="w-full h-80 bg-gray-300 rounded-md"></div>

      {/* Skeleton for Book Details */}
      <div className="p-2">
        <div className="h-5 bg-gray-300 rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
      </div>
    </div>
  );
};

export default BookSkeleton;
