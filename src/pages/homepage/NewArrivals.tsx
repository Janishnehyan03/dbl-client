import React from "react";
import { gql, useQuery } from "@apollo/client";
import BookCard from "../../components/BookCard";

// Define GraphQL query to get new arrivals
const GET_NEW_ARRIVALS = gql`
  query GetNewArrivals {
    newArrivals {
      id
      title
      publishers {
        id
        publisherName
      }
      authors {
        firstName
        lastName
      }
      # image
    }
  }
`;

const NewArrivals: React.FC = () => {
  const { loading, error, data } = useQuery(GET_NEW_ARRIVALS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="m-10 p-6 bg-white shadow-md rounded-xl">
      <div className="max-w-full px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-800 font-bold uppercase">
            New Arrivals
          </h2>
          <a href="#" className="text-blue-500 text-sm hover:underline">
            See All
          </a>
        </div>

        {/* Book Cards in a Grid */}
        <div className="lg:grid lg:grid-cols-4 gap-2">
          {data.newArrivals.length > 0 &&
            data.newArrivals.map((book: any, i: number) => (
              <BookCard book={book} key={i} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
