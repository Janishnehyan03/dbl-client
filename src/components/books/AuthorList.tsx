import { Author } from "../../utils/types";

interface AuthorListProps {
  authors: Author[];
}

const AuthorList = ({ authors }: AuthorListProps) => {
  if (authors.length === 0) return <p>No authors listed</p>;

  return (
    <ul className="space-y-1">
      {authors.map((author) => (
        <li key={author._id} className="flex items-center">
          <span className="text-gray-800">{author.name}</span>
          {author.email && (
            <a
              href={`mailto:${author.email}`}
              className="ml-2 text-blue-500 hover:underline"
            >
              {author.email}
            </a>
          )}
          {author.contactNumber && (
            <span className="ml-2 text-gray-600">
              {author.contactNumber}
            </span>
          )}
          {author.website && (
            <a
              href={author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-500 hover:underline"
            >
              {author.website}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};

export default AuthorList;
