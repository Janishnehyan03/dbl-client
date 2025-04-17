import { IClass, Section, IDivision } from "../../utils/types";

interface ClassTableProps {
  classes: IClass[];
  sections: Section[];
  divisions: IDivision[];
  onEdit: (classData: IClass) => void;
  onDelete: (id: string) => void;
}

export const ClassTable = ({ classes, onEdit, onDelete }: ClassTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-indigo-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider"
            >
              Class Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider"
            >
              Section
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-indigo-800 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classes.map((classItem) => (
            <tr key={classItem._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {classItem.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {classItem.section && classItem.section?.name}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(classItem)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => classItem._id && onDelete(classItem._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
