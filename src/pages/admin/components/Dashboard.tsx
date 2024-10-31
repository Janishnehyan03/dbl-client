// components/Dashboard.tsx
import React from "react";
import Stats from "./Stats.tsx";
import FeesPending from "./FeesPending.tsx";
import StudentProfile from "./StudentProfile.tsx";
import BookIssuedReturned from "./BookIssuedReturned.tsx";
import Wishlist from "./Wishlist.tsx";

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 lg:p-8 p-1 overflow-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome Admin 👋</h2>
        </div>
      </header>
      <Stats />
      <FeesPending />
      <StudentProfile />
      <BookIssuedReturned />
      <Wishlist />
    </div>
  );
};

export default Dashboard;
