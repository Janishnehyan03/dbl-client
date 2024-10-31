import React from 'react';

const BookIssuedReturned: React.FC = () => {
  const bookData = [
    { sno: 'A02', student: 'Floyd Miles', book: 'The Journey Within', issued: 'May 22, 2023', return: 'July 20, 2023', status: 'Paid' },
    { sno: 'A05', student: 'Robert Fox', book: 'Hidden Secrets', issued: 'May 21, 2023', return: 'Aug 10, 2023', status: 'Pending' },
    // Add more book data...
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
      <h3 className="text-2xl font-semibold mb-6 text-primary-900">Book Issued/Returned</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-3 px-4 text-left font-medium">Sno.</th>
            <th className="py-3 px-4 text-left font-medium">Student Name</th>
            <th className="py-3 px-4 text-left font-medium">Book Name</th>
            <th className="py-3 px-4 text-left font-medium">Issued Date</th>
            <th className="py-3 px-4 text-left font-medium">Return Date</th>
            <th className="py-3 px-4 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookData.map((book, index) => (
            <tr
              key={index}
              className={`transition duration-300 ease-in-out ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-gray-100`}
            >
              <td className="py-4 px-4 border-b">{book.sno}</td>
              <td className="py-4 px-4 border-b">{book.student}</td>
              <td className="py-4 px-4 border-b">{book.book}</td>
              <td className="py-4 px-4 border-b">{book.issued}</td>
              <td className="py-4 px-4 border-b">{book.return}</td>
              <td className="py-4 px-4 border-b">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    book.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {book.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookIssuedReturned;
