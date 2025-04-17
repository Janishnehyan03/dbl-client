import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClassManagement from "../../components/classes/ClassManagement";
import { DepartmentsPage } from "../departments/DepartmenPage"; // Assuming typo: "DepartmenPage" -> "DepartmentsPage"
import { DivisionsPage } from "../divisions/DivisionsPage";
import SectionsPage from "../sections/SectionsPage";
import { Settings, BookOpen, Building, Layers, Grid } from "lucide-react";

type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

const tabs: Tab[] = [
  {
    id: "sections",
    label: "Sections",
    icon: <Grid className="w-5 h-5" />,
    component: <SectionsPage />,
  },
  {
    id: "classes",
    label: "Classes",
    icon: <BookOpen className="w-5 h-5" />,
    component: <ClassManagement />,
  },
  {
    id: "departments",
    label: "Departments",
    icon: <Building className="w-5 h-5" />,
    component: <DepartmentsPage />,
  },
  {
    id: "divisions",
    label: "Divisions",
    icon: <Layers className="w-5 h-5" />,
    component: <DivisionsPage />,
  },
];

const AcademicManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Settings className="mr-3 text-indigo-600" size={32} />
          Academic Management
        </h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex space-x-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AcademicManagementPage;
