import React from "react";
import NewArrivals from "./NewArrivals";
import CategoriesCard from "./CategoriesCard";
import HeroSection from "./HeroSection";
import MissionVision from "../../components/MissionVision";
import DailyQuotes from "../../components/DailyQuotes";
import Footer from "../../components/home/LibraryFooter";

const HomePage: React.FC = () => {
  return (
    <main className="bg-gray-50 text-gray-800 h-screen overflow-auto">
      <HeroSection />
      <NewArrivals />
      <DailyQuotes />
      <CategoriesCard />
      <MissionVision />
      <Footer />
    </main>
  );
};

export default HomePage;
