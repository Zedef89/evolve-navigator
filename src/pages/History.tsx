import React from "react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import HistoryComponent from "@/components/History";
import NavBar from "@/components/NavBar";

const History: React.FC = () => {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <NavBar />
        <main>
          <HistoryComponent />
        </main>
      </div>
    </AssessmentProvider>
  );
};

export default History;