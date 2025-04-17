import React from "react";
import AddNewBookForm from "../../components/book-form/AddNewBookForm";

const AddNewBookPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <AddNewBookForm />
      </div>
    </div>
  );
};

export default AddNewBookPage;
