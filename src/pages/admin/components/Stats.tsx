// src/components/Stats.js
import { useQuery } from "@apollo/client";
import { Book, FileArchive, FileText, Users } from "lucide-react";
import { GET_BOOKS_COUNT } from "../../../graphql/queries/bookQuery";
import { GET_TOTAL_MEMBERS } from "../../../graphql/queries/memberQuery";

const StatCard = ({ title, value, icon }: any) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-gray-500 mb-2">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-primary-800 text-white p-4 rounded-full">{icon}</div>
    </div>
  </div>
);

const Stats = () => {
  const { loading, error: error, data } = useQuery(GET_BOOKS_COUNT);
  const {
    loading: memberLoading,
    error: memberError,
    data: memberData,
  } = useQuery(GET_TOTAL_MEMBERS);

  if (loading || memberLoading) return <p>Loading...</p>;
  if (error || memberError) {
    console.error(`[Error in Stats]: ${error?.message}`, {
      stack: error?.networkError
        ? error?.networkError.stack
        : error?.graphQLErrors,
    });
    return <p>Error fetching data: {error?.message}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <StatCard title="Total Students" value={memberData.studentsCount.toString()} icon={<Users />} />
      <StatCard
        title="Books Available"
        value={data.totalBooks.toString()}
        icon={<Book />}
      />
      <StatCard
        title="Books Issued"
        value={data.issuedBooks.toString()}
        icon={<FileText />}
      />
      <StatCard
        title="Books Due for Return"
        value={data.dueBooks.toString()}
        icon={<FileArchive />}
      />
    </div>
  );
};

export default Stats;
