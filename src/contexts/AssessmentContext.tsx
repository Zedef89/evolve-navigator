
import React, { createContext, useContext, useState, useEffect } from "react";
import { Assessment, AreaType, mockAssessments, areas } from "@/lib/mockData";
import { toast } from "sonner";

interface AssessmentContextType {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  isLoading: boolean;
  startNewAssessment: () => void;
  updateScore: (areaId: AreaType, score: number) => void;
  updateNote: (areaId: AreaType, note: string) => void;
  saveAssessment: () => void;
  cancelAssessment: () => void;
  deleteAssessment: (id: string) => void;
  exportData: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data from storage
  useEffect(() => {
    const loadData = async () => {
      // In a real app, we would load from localStorage or a backend
      setTimeout(() => {
        setAssessments(mockAssessments);
        setIsLoading(false);
      }, 800);
    };

    loadData();
  }, []);

  const startNewAssessment = () => {
    const newAssessment: Assessment = {
      id: `assessment-${Date.now()}`,
      date: new Date(),
      scores: {
        tech: 5,
        personal: 5,
        business: 5,
        social: 5,
      },
      notes: {
        tech: "",
        personal: "",
        business: "",
        social: "",
      },
    };

    setCurrentAssessment(newAssessment);
  };

  const updateScore = (areaId: AreaType, score: number) => {
    if (!currentAssessment) return;

    setCurrentAssessment({
      ...currentAssessment,
      scores: {
        ...currentAssessment.scores,
        [areaId]: score,
      },
    });
  };

  const updateNote = (areaId: AreaType, note: string) => {
    if (!currentAssessment) return;

    setCurrentAssessment({
      ...currentAssessment,
      notes: {
        ...currentAssessment.notes,
        [areaId]: note,
      },
    });
  };

  const saveAssessment = () => {
    if (!currentAssessment) return;

    setAssessments([currentAssessment, ...assessments]);
    setCurrentAssessment(null);
    
    toast.success("Assessment saved successfully!");
    
    // In a real app, we would save to localStorage or a backend here
  };

  const cancelAssessment = () => {
    setCurrentAssessment(null);
    toast("Assessment cancelled", {
      description: "Your changes have been discarded."
    });
  };

  const deleteAssessment = (id: string) => {
    setAssessments(assessments.filter(a => a.id !== id));
    toast.success("Assessment deleted successfully!");
  };

  const exportData = () => {
    const dataStr = JSON.stringify(assessments, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `growth-assessment-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Data exported successfully!");
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessments,
        currentAssessment,
        isLoading,
        startNewAssessment,
        updateScore,
        updateNote,
        saveAssessment,
        cancelAssessment,
        deleteAssessment,
        exportData,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
