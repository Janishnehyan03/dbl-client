import { IAuthor } from "../../utils/types";

interface AuthorListProps {
  authors: IAuthor[];
  inline: boolean;
}

const AuthorList = ({ authors, inline }: AuthorListProps) => {
  if (authors.length === 0) return <p>No authors listed</p>;

  return (
    <div className={`${inline ? "flex  items-center space-x-2" : ""}`}>
      {authors.map((author) => (
        <p key={author._id}>{author.name}</p>
      ))}
    </div>
  );
};

export default AuthorList;
