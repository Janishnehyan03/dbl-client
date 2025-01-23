import { Link } from "react-router-dom";

function BookCard({ book }: { book: any }) {
  // Array of placeholder images
  const images = [
    "https://images.unsplash.com/photo-1539877254216-818ed7c76096?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1730055194055-2ecec719fa5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2slMjBjb3ZlcnxlbnwwfHwwfHx8",
    "https://images.unsplash.com/photo-1735656244152-5d0ad782f71d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8", "https://plus.unsplash.com/premium_photo-1690522330973-021425184c2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D", "https://plus.unsplash.com/premium_photo-1731680780948-249419f8cd50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMnx8fGVufDB8fHx8fA%3D%3D"];

  return (
    <div className="max-w-sm overflow-hidden">
      <Link to={`/book/${book.id}`} className="block cursor-pointer">
      {/* Book Cover */}
      <img
        src={images[Math.floor(Math.random() * images.length)]}
        alt={book.title}
        className="w-full h-80 object-cover"
      />

      {/* Book Details */}
      <div className="p-2" >
        <h3 className="font-bold text-lg text-gray-800 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600">
          {book.authors && book.authors.length > 0
            ? book.authors
              .map((author: any) => `${author.firstName} ${author.lastName}`)
              .join(", ")
            : "Unknown Author"}
        </p>

      </div>
      </Link>
    </div>
  );
}

export default BookCard;
