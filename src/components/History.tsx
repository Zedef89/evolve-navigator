import React from "react";
import { motion } from "framer-motion";
import { useAssessment } from "@/contexts/AssessmentContext";
import { format } from "date-fns";
import { AreaType, areas } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

const History: React.FC = () => {
  const { assessments, isLoading } = useAssessment();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <h2 className="text-2xl font-bold mb-6">Assessment History</h2>
      <ScrollArea className="h-[500px] rounded-md border p-4">
        {assessments.map((assessment, index) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="mb-4 p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/assessment/${assessment.id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {format(new Date(assessment.date), "MMMM d, yyyy")}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(assessment.date), "h:mm a")}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(assessment.scores).map(([area, score]) => (
                  <div key={area} className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {areas.find(a => a.id === area)?.name}
                    </span>
                    <span className="text-lg font-medium">{score}/10</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </ScrollArea>
    </motion.div>
  );
};

export default History;