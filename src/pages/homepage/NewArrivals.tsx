import React from "react";
import { gql, useQuery } from "@apollo/client";
import BookCard from "../../components/BookCard";
import BookSkeleton from "../../components/BookSkeleton";

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

  if (loading) return <div className="grid grid-cols-5 gap-6 m-10 p-8"> {[...Array(5)].map((_,) => <BookSkeleton />)}</div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="m-10 p-8">
      <div className="max-w-full px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-gray-900 font-semibold tracking-wider">
            New Arrivals
          </h2>
          <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
            See All
          </a>
        </div>

        {/* Book Cards in a Grid */}
        <div className="lg:grid lg:grid-cols-5 gap-6">
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
