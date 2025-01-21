import React from "react";

interface GrayTableProps {
  headers: string[];
  rows: any[];
  onRowClick?: (row: any, index: number) => void;
}

const GrayTable: React.FC<GrayTableProps> = ({ headers, rows, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-600">
            {headers.map((header, index) => (
              <th key={index} className="pb-2 border-b-2 min-w-[100px]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} cursor-pointer`}
              onClick={() => onRowClick && onRowClick(row, index)}
            >
              {Object.values(row).map((value: any, cellIndex) => (
                <td
                  key={cellIndex}
                  className="py-3 px-4 border-b whitespace-nowrap"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrayTable;
