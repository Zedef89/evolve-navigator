
import React from "react";
import { motion } from "framer-motion";
import { useAssessment } from "@/contexts/AssessmentContext";
import { areas, calculateAverageScore, getInsights } from "@/lib/mockData";
import AreaCard from "./AreaCard";
import ProgressChart from "./ProgressChart";
import InsightCard from "./InsightCard";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const { assessments, isLoading } = useAssessment();
  
  const latestAssessment = assessments.length > 0 ? assessments[0] : null;
  const averageScore = latestAssessment ? calculateAverageScore(latestAssessment) : 0;
  const insights = assessments.length > 0 ? getInsights(assessments) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      className="p-4 md:p-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-2">
          {assessments.length > 0
            ? `${averageScore.toFixed(1)}/10`
            : "Welcome!"}
        </h1>
        <p className="text-gray-500">
          {assessments.length > 0
            ? "Your overall growth score"
            : "Start your first assessment to begin tracking your growth"}
        </p>
      </motion.div>

      {assessments.length > 0 ? (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            variants={containerVariants}
          >
            {areas.map((area) => (
              <AreaCard
                key={area.id}
                area={area}
                assessments={assessments}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
            <ProgressChart assessments={assessments} />
          </motion.div>

          {insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold mb-4">Insights</h2>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <InsightCard 
                    key={index} 
                    insight={insight}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="max-w-md mx-auto">
            <p className="text-gray-500 mb-8">
              Track your progress across four key areas of life:
              Technology, Personal Growth, Business, and Relationships.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {areas.map((area) => (
                <div 
                  key={area.id}
                  className="rounded-lg p-4 text-white text-center"
                  style={{ backgroundColor: area.color }}
                >
                  <h3 className="font-medium text-sm md:text-base">{area.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <Skeleton className="h-10 w-24 mx-auto mb-2" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>

      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>

      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
