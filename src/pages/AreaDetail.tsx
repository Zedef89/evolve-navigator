
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AssessmentProvider, useAssessment } from "@/contexts/AssessmentContext";
import NavBar from "@/components/NavBar";
import ProgressChart from "@/components/ProgressChart";
import { AreaType, areas, getAreaTrend } from "@/lib/constants";
import { TrendingUp, TrendingDown, Calendar, LucideProps } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";

const AreaDetailContent: React.FC = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const { assessments, isLoading } = useAssessment();

  if (isLoading) {
    return <AreaDetailSkeleton />;
  }

  if (!areaId || !areas.find(a => a.id === areaId)) {
    return <Navigate to="/" />;
  }

  const area = areas.find(a => a.id === areaId)!;
  const typedAreaId = areaId as AreaType;
  const latestAssessment = assessments.length > 0 ? assessments[0] : null;
  const score = latestAssessment ? latestAssessment.scores[typedAreaId] : 0;
  const trend = assessments.length > 1 ? getAreaTrend(assessments, typedAreaId) : null;

  // Update the getIconComponent function
  const getIconComponent = () => {
    const iconName = area.icon;
    const capitalizedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const IconComponent = LucideIcons[capitalizedIconName as keyof typeof LucideIcons] as React.ComponentType<LucideProps>;
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center mb-4 md:mb-0">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mr-4 text-white"
              style={{ backgroundColor: area.color }}
            >
              {getIconComponent()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{area.name}</h1>
              <p className="text-gray-500">{area.description}</p>
            </div>
          </div>
          
          {latestAssessment && (
            <div className="flex flex-col items-end">
              <div className="text-4xl font-bold">{score}/10</div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-gray-500">
                  Last updated: {format(latestAssessment.date, "MMM d, yyyy")}
                </span>
              </div>
            </div>
          )}
        </div>

        {trend && (
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm mb-6 ${
              trend.increasing ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {trend.increasing ? (
              <TrendingUp className="w-4 h-4 mr-2" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-2" />
            )}
            <span>
              {trend.increasing ? "Increased" : "Decreased"} by {trend.percentage}% in the last 4 assessments
            </span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
        <ProgressChart assessments={assessments} areaId={typedAreaId} height={400} />
      </motion.div>

      {assessments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
          <div className="space-y-4">
            {assessments.slice(0, 3).map((assessment) => (
              <div 
                key={assessment.id} 
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-500 text-sm">
                    {format(assessment.date, "MMMM d, yyyy")}
                  </div>
                  <div 
                    className="px-2 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${area.color}20`, 
                      color: area.color 
                    }}
                  >
                    Score: {assessment.scores[typedAreaId]}/10
                  </div>
                </div>
                <p className="text-gray-700">
                  {assessment.notes[typedAreaId] || "No notes provided for this assessment."}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const AreaDetailSkeleton: React.FC = () => {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Skeleton className="w-12 h-12 rounded-full mr-4" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="h-10 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>

      <div>
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

const AreaDetail: React.FC = () => {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <NavBar />
        <main>
          <AreaDetailContent />
        </main>
      </div>
    </AssessmentProvider>
  );
};

export default AreaDetail;

// Remove these lines completely
// const areas = [
//   { id: 'tech', name: 'Technology & Scientific Knowledge', color: '#0ea5e9' },
//   { id: 'personal', name: 'Personal Growth', color: '#22c55e' },
//   { id: 'business', name: 'Business & Finance', color: '#f59e0b' },
//   { id: 'social', name: 'Intimate & Social Relationships', color: '#ec4899' }
// ];
