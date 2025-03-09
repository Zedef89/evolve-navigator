
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAssessment } from "@/contexts/AssessmentContext";
import { areaQuestions, AreaType, areas } from "@/lib/mockData";
import ScoreInput from "@/components/ScoreInput";
import { ChevronRight, ChevronLeft, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AssessmentForm: React.FC = () => {
  const [currentArea, setCurrentArea] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentAssessment, updateScore, updateNote, saveAssessment, cancelAssessment } = useAssessment();
  const navigate = useNavigate();

  if (!currentAssessment) {
    navigate("/");
    return null;
  }

  const area = areas[currentArea];
  const areaType = area.id as AreaType;
  const questions = areaQuestions[areaType];
  const score = currentAssessment.scores[areaType];
  const note = currentAssessment.notes[areaType];

  const handleNext = () => {
    if (currentArea < areas.length - 1) {
      setCurrentArea(currentArea + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentArea > 0) {
      setCurrentArea(currentArea - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await saveAssessment();
      navigate("/");
    } catch (error) {
      console.error("Error saving assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    cancelAssessment();
    navigate("/");
  };

  const progressPercentage = ((currentArea + 1) / areas.length) * 100;
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Assessment Progress</h2>
          <span className="text-sm text-gray-500">
            {currentArea + 1} of {areas.length}
          </span>
        </div>
        
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: area.color }}
            initial={{ width: `${((currentArea) / areas.length) * 100}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false} custom={1}>
        <motion.div
          key={area.id}
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="mb-6"
        >
          <div
            className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: `${area.color}20`, color: area.color }}
          >
            {area.name}
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="pb-2">
                <p className="mb-1 text-gray-700">{question}</p>
              </div>
            ))}

            <div>
              <ScoreInput 
                value={score} 
                onChange={(value) => updateScore(areaType, value)} 
                areaColor={area.color}
              />
            </div>

            <div>
              <Label htmlFor="notes" className="mb-2 block">
                Additional notes (optional)
              </Label>
              <Textarea
                id="notes"
                value={note}
                onChange={(e) => updateNote(areaType, e.target.value)}
                placeholder="Add any additional thoughts or reflections..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between space-x-4 mt-8">
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleCancel} 
          className="focus-ring"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <div className="flex-1 flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentArea === 0}
            className="focus-ring"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentArea < areas.length - 1 ? (
            <Button onClick={handleNext} className="focus-ring">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="focus-ring"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;
