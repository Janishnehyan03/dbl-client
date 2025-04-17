import { useEffect, useState, useRef } from "react";

interface CheckboxProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label = "",
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={checkboxRef}
          id="checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        />
      </div>
      {label && (
        <label
          htmlFor="checkbox"
          className={`ml-2 text-sm font-medium text-gray-700 ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
