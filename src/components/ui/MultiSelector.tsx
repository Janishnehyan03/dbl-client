import { useEffect, useState, useRef } from "react";

interface Item {
  [key: string]: any;
}

interface MultiSelectProps {
  items: Item[];
  selectedItems?: Item[];
  onSelectionChange?: (items: Item[]) => void;
  label?: string;
  placeholder?: string;
  itemLabelKey?: string;
  itemValueKey?: string;
  searchPlaceholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  items = [],
  selectedItems: initialSelectedItems = [],
  onSelectionChange,
  label = "Select items",
  placeholder = "Select items...",
  itemLabelKey = "name",
  itemValueKey = "id",
  searchPlaceholder = "Search items...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] =
    useState<Item[]>(initialSelectedItems);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedItems(initialSelectedItems);
    setAvailableItems(items);
  }, [items, initialSelectedItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm("");
  };

  const handleItemClick = (item: Item) => {
    const isSelected = selectedItems.some(
      (selected) => selected[itemValueKey] === item[itemValueKey]
    );

    const updated = isSelected
      ? selectedItems.filter(
          (selected) => selected[itemValueKey] !== item[itemValueKey]
        )
      : [...selectedItems, item];

    setSelectedItems(updated);
    onSelectionChange?.(updated);
  };

  const removeItem = (item: Item) => {
    const updated = selectedItems.filter(
      (selected) => selected[itemValueKey] !== item[itemValueKey]
    );
    setSelectedItems(updated);
    onSelectionChange?.(updated);
  };

  const filteredItems = availableItems.filter((item) => {
    const matchesSearch = item[itemLabelKey]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isNotSelected = !selectedItems.some(
      (selected) => selected[itemValueKey] === item[itemValueKey]
    );
    return matchesSearch && isNotSelected;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="font-sans w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <label className="block mb-2 text-sm font-medium text-gray-800">
        {label}
      </label>

      <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 border border-gray-300 rounded-lg min-h-[50px]">
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <div
              key={item[itemValueKey]}
              className="flex items-center bg-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 hover:bg-gray-300 transition"
            >
              {item[itemLabelKey]}
              <button
                onClick={() => removeItem(item)}
                className="ml-2 text-gray-500 hover:text-red-600 text-sm"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-500 italic">No items selected</span>
        )}
      </div>

      <div className="relative">
        <div
          className="px-4 py-2 bg-white border border-gray-300 rounded-md flex justify-between items-center text-sm text-gray-700 cursor-pointer hover:border-gray-400"
          onClick={toggleDropdown}
        >
          <span>{placeholder}</span>
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>

        {isOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md z-50">
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <ul className="max-h-60 overflow-y-auto text-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isSelected = selectedItems.some(
                    (selected) => selected[itemValueKey] === item[itemValueKey]
                  );

                  return (
                    <li
                      key={item[itemValueKey]}
                      onClick={() => {
                        handleItemClick(item);
                        setIsOpen(false);
                      }}
                      className={`flex items-center px-4 py-2 cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        readOnly
                      />
                      {item[itemLabelKey]}
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-2 text-gray-500 italic">
                  {searchTerm
                    ? "No matching items found"
                    : "No more items available"}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
