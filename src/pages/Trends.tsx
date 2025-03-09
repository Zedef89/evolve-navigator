import React from "react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import TrendsComponent from "@/components/TrendsComponent";
import NavBar from "@/components/NavBar";

const Trends: React.FC = () => {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <NavBar />
        <main>
          <TrendsComponent />
        </main>
      </div>
    </AssessmentProvider>
  );
};

export default Trends;