import React from "react";
import { motion } from "framer-motion";
import { useAssessment } from "@/contexts/AssessmentContext";
import { Card } from "@/components/ui/card";
import { areas } from "@/lib/mockData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths } from "date-fns";

const TrendsComponent: React.FC = () => {
  const { assessments } = useAssessment();

  const calculateTrend = (areaId: string) => {
    if (assessments.length < 2) return { trend: 0, difference: 0 };
    
    const sortedAssessments = [...assessments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2); // Only get the last two assessments
    
    if (!sortedAssessments[0]?.scores[areaId] || !sortedAssessments[1]?.scores[areaId]) {
      return { trend: 0, difference: 0 };
    }
    
    const latestScore = sortedAssessments[0].scores[areaId];
    const previousScore = sortedAssessments[1].scores[areaId];
    
    return {
      trend: latestScore - previousScore,
      difference: Math.abs(latestScore - previousScore)
    };
  };

  const getInsightMessage = (areaName: string, trend: number) => {
    if (trend > 1) {
      return `Great progress in ${areaName}! Keep up the good work.`;
    } else if (trend < -1) {
      return `${areaName} score has decreased. Consider focusing more on this area.`;
    }
    return `${areaName} score remains stable.`;
  };

  const prepareChartData = () => {
    if (assessments.length === 0) return [];

    return [...assessments]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(assessment => ({
        date: format(new Date(assessment.date), 'MMM dd'),
        ...assessment.scores
      }));
  };

  if (assessments.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="p-6 text-center text-muted-foreground">
          No assessment data available yet.
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-4 space-y-6"
    >
      <h2 className="text-2xl font-bold mb-6">Trends Analysis</h2>

      {/* Overall Trend Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              {areas.map((area) => (
                <Line
                  key={area.id}
                  type="monotone"
                  dataKey={area.id}
                  name={area.name}
                  stroke={area.color}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Individual Area Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => {
          const { trend, difference } = calculateTrend(area.id);
          return (
            <Card key={area.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{area.name}</h3>
                <div className="flex items-center">
                  {trend > 0 ? (
                    <TrendingUp className="text-green-500" />
                  ) : trend < 0 ? (
                    <TrendingDown className="text-red-500" />
                  ) : (
                    <Minus className="text-gray-500" />
                  )}
                  <span className="ml-2 font-medium">
                    {trend > 0 ? '+' : ''}{trend.toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {getInsightMessage(area.name, trend)}
              </p>
            </Card>
          )
        })}
      </div>
    </motion.div>
  );
};

export default TrendsComponent;