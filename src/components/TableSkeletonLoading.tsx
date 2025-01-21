const TableSkeletonLoading: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg my-3 shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-primary-900">
        Loading...
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="pb-2 border-b-2 min-w-[20px]">#</th>
              <th className="pb-2 border-b-2 min-w-[150px]">Student</th>
              <th className="pb-2 border-b-2 min-w-[150px]">Adm. No</th>
              <th className="pb-2 border-b-2 min-w-[150px]">Class</th>
              <th className="pb-2 border-b-2 min-w-[150px]">Book</th>
              <th className="pb-2 border-b-2 min-w-[100px]">Fine</th>
              <th className="pb-2 border-b-2 min-w-[100px]">Days Late</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TableSkeletonLoading;
