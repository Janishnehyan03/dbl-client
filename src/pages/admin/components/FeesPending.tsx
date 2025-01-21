import React, { useEffect, useState } from "react";
import Axios from "../../../utils/Axios";
import { useNavigate } from "react-router-dom";
import TableSkeletonLoading from "../../../components/TableSkeletonLoading";
import GrayTable from "../../../components/GrayTable";

const FeesPending: React.FC = () => {
  const [feesPendingData, setFeesPendingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeesPendingData = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("/issues");
        setFeesPendingData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching fees pending data:", error);
      }
    };

    fetchFeesPendingData();
  }, []);

  if (loading) {
    return <TableSkeletonLoading />;
  }

  const headers = [
    "#",
    "Student",
    "Adm. No",
    "Class",
    "Book",
    "Fine",
    "Days Late",
  ];
  const rows = feesPendingData.map((item: any, index) => ({
    "#": index + 1,
    Student: <span className="text-blue-600">{item.member.studentName}</span>,
    "Adm. No": item.member.admissionNumber,
    Class: item?.member?.class?.className,
    Book: item.book.title,
    Fine: `₹${item.fine}`,
    "Days Late": item.daysLate,
  }));

  return (
    <div className="bg-white p-6 rounded-lg my-3 shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-primary-900">
        Fees Pending
      </h3>
      <GrayTable
        headers={headers}
        rows={rows}
        onRowClick={(_: any, index) =>
          navigate(`/profile/${feesPendingData[index].member._id}`)
        }
      />
    </div>
  );
};

export default FeesPending;
