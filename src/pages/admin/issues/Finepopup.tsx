import React, { useState } from 'react';

interface FinePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paidAmount: number) => void;
  fineAmount: number;
}

const FinePopup: React.FC<FinePopupProps> = ({ isOpen, onClose, onConfirm, fineAmount }) => {
  const [paidAmount, setPaidAmount] = useState<number>(0);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (paidAmount < fineAmount) {
      alert(`Please pay at least ₹${fineAmount}.`); // Basic validation
    } else {
      onConfirm(paidAmount);
      setPaidAmount(0); // Reset paid amount after confirmation
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4">Fine Amount</h2>
        <p className="text-lg mb-4">Please pay the fine of ₹{fineAmount} before returning the book.</p>
        
        <input
          type="number"
          value={paidAmount}
          onChange={(e) => setPaidAmount(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full"
          placeholder="Enter amount paid"
        />
        
        <div className="flex justify-between">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleConfirm}
          >
            Return Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinePopup;
