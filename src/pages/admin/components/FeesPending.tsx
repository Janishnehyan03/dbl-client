import React, { useEffect, useState } from "react";
import Axios from "../../../utils/Axios";
import { useNavigate } from "react-router-dom";

const FeesPending: React.FC = () => {
  const [feesPendingData, setFeesPendingData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeesPendingData = async () => {
      try {
        const response = await Axios.get("/issues");
        setFeesPendingData(response.data);
      } catch (error) {
        console.error("Error fetching fees pending data:", error);
      }
    };

    fetchFeesPendingData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg my-3 shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-primary-900">
        Fees Pending
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
            {feesPendingData.map((item: any, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                onClick={() => navigate(`/profile/${item.member._id}`)}
              >
                <td className="py-3 px-4 border-b ">{index + 1}</td>
                <td className="py-3 px-4 border-b whitespace-nowrap text-blue-600 cursor-pointer">
                  {item.member.studentName}
                </td>
                <td className="py-3 px-4 border-b whitespace-nowrap">
                  {item.member.admissionNumber}
                </td>
                <td className="py-3 px-4 border-b whitespace-nowrap">
                  {item?.member?.class?.className}
                </td>
                <td className="py-3 px-4 border-b whitespace-nowrap">
                  {item.book.title}
                </td>
                <td className="py-3 px-4 border-b whitespace-nowrap">
                  ₹{item.fine}
                </td>
                <td className="py-3 px-4 border-b whitespace-nowrap">
                  {item.daysLate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeesPending;
