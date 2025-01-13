import React, { useState } from "react";
import { LibraryDetails } from "../../../utils/types";

interface Props {
  onSubmit: (data: LibraryDetails) => void;
  initialData?: LibraryDetails;
}

const ConfigurationForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<LibraryDetails>(initialData || {
    libraryName: "",
    libraryAddress: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-md">
      <div>
        <label className="block text-sm font-medium">Library Name</label>
        <input
          type="text"
          name="libraryName"
          value={formData.libraryName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Library Address</label>
        <input
          type="text"
          name="libraryAddress"
          value={formData.libraryAddress}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Contact Email</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Contact Phone</label>
        <input
          type="tel"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full py-2 bg-teal-500 text-white rounded">
        Save Configuration
      </button>
    </form>
  );
};

export default ConfigurationForm;
