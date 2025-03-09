
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { db, auth } from "@/lib/firebase"; // Add auth import
import { collection, query, orderBy, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

interface Assessment {
  id: string;
  date: string;
  scores: Record<string, number>;
  notes: Record<string, string>;
  userId: string;
  createdAt: string;
}

interface AssessmentContextType {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  isLoading: boolean;
  addAssessment: (assessment: Omit<Assessment, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  startNewAssessment: () => void;
  exportData: () => void;
  // Add these new methods
  updateScore: (areaId: string, score: number) => void;
  updateNote: (areaId: string, note: string) => void;
  saveAssessment: () => Promise<void>;
  cancelAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAssessments = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const assessmentsRef = collection(db, 'users', user.uid, 'assessments');
      const q = query(assessmentsRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const loadedAssessments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assessment[];
      
      setAssessments(loadedAssessments);
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAssessment = async () => {
    if (!currentAssessment || !user) return;
    
    try {
      const assessmentData = {
        ...currentAssessment,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };
      
      const assessmentsRef = collection(db, 'users', user.uid, 'assessments');
      await addDoc(assessmentsRef, assessmentData);
      
      setCurrentAssessment(null);
      await loadAssessments();
    } catch (error) {
      console.error("Error saving assessment:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadAssessments();
  }, [user]); // Change dependency from auth.currentUser to user

  const addAssessment = async (assessment: Omit<Assessment, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      toast.error('Please sign in to save assessments');
      return;
    }

    try {
      const assessmentWithUser = {
        ...assessment,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      // Fix: Use the correct collection path
      const assessmentsRef = collection(db, 'users', user.uid, 'assessments');
      const docRef = await addDoc(assessmentsRef, assessmentWithUser);
      
      const newAssessment = {
        ...assessmentWithUser,
        id: docRef.id,
      };
      
      setAssessments(prev => [newAssessment, ...prev]);
      toast.success('Assessment saved successfully');
    } catch (error) {
      console.error('Error adding assessment:', error);
      toast.error('Failed to save assessment');
    }
  };

  const startNewAssessment = () => {
    setCurrentAssessment(null);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(assessments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `growth-assessment-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const updateScore = (areaId: string, score: number) => {
    if (!currentAssessment) return;
    setCurrentAssessment({
      ...currentAssessment,
      scores: {
        ...currentAssessment.scores,
        [areaId]: score
      }
    });
  };

  const updateNote = (areaId: string, note: string) => {
    if (!currentAssessment) return;
    setCurrentAssessment({
      ...currentAssessment,
      notes: {
        ...currentAssessment.notes,
        [areaId]: note
      }
    });
  };

  const cancelAssessment = () => {
    setCurrentAssessment(null);
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessments,
        currentAssessment,
        isLoading,
        addAssessment,
        startNewAssessment,
        exportData,
        // Add the new methods to the context value
        updateScore,
        updateNote,
        saveAssessment,
        cancelAssessment
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
