import React from "react";
import NewArrivals from "./NewArrivals";
import CategoriesCard from "./CategoriesCard";
import HeroSection from "./HeroSection";
import MissionVision from "../../components/MissionVision";

const HomePage: React.FC = () => {
  return (
    <main className="bg-gray-50 text-gray-800 h-screen overflow-auto">
      <HeroSection />
      <NewArrivals />
      <CategoriesCard />
      <MissionVision />
    </main>
  );
};

export default HomePage;
