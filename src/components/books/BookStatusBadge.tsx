type BookStatus = "available" | "checked_out" | "lost" | "damaged";
interface BookStatusBadgeProps {
  status: BookStatus;
}

const statusColors = {
  available: "bg-green-100 text-green-800",
  checked_out: "bg-yellow-100 text-yellow-800",
  lost: "bg-red-100 text-red-800",
  damaged: "bg-orange-100 text-orange-800",
};

const statusLabels = {
  available: "Available",
  checked_out: "Checked Out",
  lost: "Lost",
  damaged: "Damaged",
};

const BookStatusBadge = ({ status }: BookStatusBadgeProps) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};

export default BookStatusBadge;
