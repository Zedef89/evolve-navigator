
import React from "react";
import { AnimatePresence } from "framer-motion";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import NavBar from "@/components/NavBar";
import AssessmentForm from "@/components/AssessmentForm";

const Assessment: React.FC = () => {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <NavBar />
        <main>
          <AnimatePresence mode="wait">
            <AssessmentForm />
          </AnimatePresence>
        </main>
      </div>
    </AssessmentProvider>
  );
};

export default Assessment;
