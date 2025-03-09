import React from "react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import NewAssessmentComponent from "@/components/NewAssessment";
import NavBar from "@/components/NavBar";

const NewAssessment: React.FC = () => {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <NavBar />
        <main>
          <NewAssessmentComponent />
        </main>
      </div>
    </AssessmentProvider>
  );
};

export default NewAssessment;