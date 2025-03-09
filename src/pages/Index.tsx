
import React from "react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import Dashboard from "@/components/Dashboard";
import NavBar from "@/components/NavBar";
import { AnimatePresence } from "framer-motion";

const Index: React.FC = () => {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <NavBar />
        <main>
          <AnimatePresence mode="wait">
            <Dashboard />
          </AnimatePresence>
        </main>
      </div>
    </AssessmentProvider>
  );
};

export default Index;
