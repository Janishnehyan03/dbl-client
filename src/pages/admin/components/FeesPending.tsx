import React from 'react';

const FeesPending: React.FC = () => {
  const feesPendingData = [
    { student: 'Ajony Haust', date: 'May 25, 2023', amount: '$31.48', status: 'Pending' },
    { student: 'Jimmy Fermin', date: 'May 31, 2023', amount: '$50.18', status: 'Pending' },
    { student: 'Ajony Haust', date: 'May 25, 2023', amount: '$31.48', status: 'Pending' },
    { student: 'Jimmy Fermin', date: 'May 31, 2023', amount: '$50.18', status: 'Pending' },
    { student: 'Ajony Haust', date: 'May 25, 2023', amount: '$31.48', status: 'Pending' },
    { student: 'Jimmy Fermin', date: 'May 31, 2023', amount: '$50.18', status: 'Pending' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg  my-3 shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-primary-900">Fees Pending</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="pb-2 border-b-2 min-w-[150px]">Student</th>
              <th className="pb-2 border-b-2 min-w-[150px]">Date</th>
              <th className="pb-2 border-b-2 min-w-[100px]">Amount</th>
              <th className="pb-2 border-b-2 min-w-[100px]">Status</th>
              <th className="pb-2 border-b-2 min-w-[100px]">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {feesPendingData.map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                <td className="py-3 px-4 border-b whitespace-nowrap">{item.student}</td>
                <td className="py-3 px-4 border-b whitespace-nowrap">{item.date}</td>
                <td className="py-3 px-4 border-b whitespace-nowrap">{item.amount}</td>
                <td className="py-3 px-4 border-b">
                  <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 border-b text-center whitespace-nowrap">📄</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeesPending;
