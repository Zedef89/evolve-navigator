import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAssessment } from "@/contexts/AssessmentContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
// Remove this import
// import { areas } from "@/lib/mockData";

// Add this constant
const areas = [
  { id: 'tech', name: 'Technology & Scientific Knowledge', color: '#0ea5e9' },
  { id: 'personal', name: 'Personal Growth', color: '#22c55e' },
  { id: 'business', name: 'Business & Finance', color: '#f59e0b' },
  { id: 'social', name: 'Intimate & Social Relationships', color: '#ec4899' }
];

import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface AreaAssessment {
  score: number;
  notes: string;
}

const NewAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addAssessment } = useAssessment(); // Remove the type assertion
  
  const [currentArea, setCurrentArea] = useState(0);
  const [assessments, setAssessments] = useState<Record<string, AreaAssessment>>(
    Object.fromEntries(
      areas.map((area) => [area.id, { score: 5, notes: "" }])
    )
  );

  const handleNext = () => {
    if (currentArea < areas.length - 1) {
      setCurrentArea(currentArea + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentArea > 0) {
      setCurrentArea(currentArea - 1);
    }
  };

  const handleSubmit = () => {
    const scores = Object.fromEntries(
      Object.entries(assessments).map(([key, value]) => [key, value.score])
    );
    const notes = Object.fromEntries(
      Object.entries(assessments).map(([key, value]) => [key, value.notes])
    );

    addAssessment({
      date: new Date().toISOString(),
      scores,
      notes,
    }); // Removed id since it's handled by Firebase

    toast({
      title: "Assessment Completed",
      description: "Your assessment has been saved successfully.",
    });

    navigate("/trends");
  };

  const currentAreaData = areas[currentArea];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-4 space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">New Assessment</h2>
        <span className="text-sm text-muted-foreground">
          {currentArea + 1} of {areas.length}
        </span>
      </div>

      <Card className="p-6">
        <motion.div
          key={currentAreaData.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold mb-4">{currentAreaData.name}</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Score (1-10)
              </label>
              <Slider
                value={[assessments[currentAreaData.id].score]}
                onValueChange={(value) => {
                  setAssessments({
                    ...assessments,
                    [currentAreaData.id]: {
                      ...assessments[currentAreaData.id],
                      score: value[0],
                    },
                  });
                }}
                max={10}
                min={1}
                step={1}
              />
              <div className="text-center text-2xl font-bold mt-2">
                {assessments[currentAreaData.id].score}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notes and Reflections
              </label>
              <Textarea
                value={assessments[currentAreaData.id].notes}
                onChange={(e) =>
                  setAssessments({
                    ...assessments,
                    [currentAreaData.id]: {
                      ...assessments[currentAreaData.id],
                      notes: e.target.value,
                    },
                  })
                }
                placeholder="Share your thoughts and experiences..."
                className="h-32"
              />
            </div>
          </div>
        </motion.div>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentArea === 0}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
        >
          {currentArea === areas.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </motion.div>
  );
};

export default NewAssessment;