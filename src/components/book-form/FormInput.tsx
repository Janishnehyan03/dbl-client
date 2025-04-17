import React from "react";

export interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: string; // Added min property
  step?: string; // Added step property
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  required = false,
  step,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        required={required}
        step={step}
      />
    </div>
  );
};

export default FormInput;