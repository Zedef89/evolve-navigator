
import React from "react";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import Dashboard from "@/components/Dashboard";
import NavBar from "@/components/NavBar";
import { AnimatePresence } from "framer-motion";

// Remove mock data import
// import { mockAssessments } from "@/lib/mockData";

// Add areas constant
const areas = [
  { id: 'tech', name: 'Technology & Scientific Knowledge', color: '#0ea5e9' },
  { id: 'personal', name: 'Personal Growth', color: '#22c55e' },
  { id: 'business', name: 'Business & Finance', color: '#f59e0b' },
  { id: 'social', name: 'Intimate & Social Relationships', color: '#ec4899' }
];

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
