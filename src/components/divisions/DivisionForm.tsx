import { CheckCircleIcon, PenIcon, Plus, XIcon } from "lucide-react";
import { useState } from "react";
import { IDivision } from "../../utils/types";

interface DivisionFormProps {
  initialData?: IDivision;
  onSubmit: (data: IDivision) => void;
  onCancel: () => void;
}

export const DivisionForm = ({
  initialData,
  onSubmit,
  onCancel,
}: DivisionFormProps) => {
  const [formData, setFormData] = useState<IDivision>(
    initialData || {
      _id: "",
      name: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out group-hover:text-indigo-600"
          >
            Division Name
          </label>
        </div>
        <div className="relative mt-1 rounded-md shadow-sm transition-all duration-200 hover:shadow-md">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
            required
            placeholder="e.g. Marketing, Engineering, Operations"
            maxLength={50}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {formData.name && (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-md px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:-translate-y-0.5"
        >
          <XIcon className="h-5 w-5 mr-1.5" />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          {initialData ? (
            <>
             <PenIcon className="h-5 w-5 mr-1.5" />
              Update Division
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-1.5" />
              Create Division
            </>
          )}
        </button>
      </div>
    </form>
  );
};
