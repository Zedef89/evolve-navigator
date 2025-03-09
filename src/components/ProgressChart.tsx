
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Assessment, areas, AreaType } from "@/lib/mockData";
import { format } from "date-fns";

interface ProgressChartProps {
  assessments: Assessment[];
  areaId?: AreaType;
  height?: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  assessments, 
  areaId, 
  height = 300 
}) => {
  if (assessments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
        <p className="text-gray-500">No assessment data available yet.</p>
      </div>
    );
  }

  // Prepare the data for the chart
  const chartData = assessments
    .slice(0, 8)
    .reverse()
    .map((assessment) => {
      const data: any = {
        date: format(assessment.date, "MMM d"),
      };

      if (areaId) {
        // Single area mode
        data[areaId] = assessment.scores[areaId];
      } else {
        // All areas mode
        areas.forEach((area) => {
          data[area.id] = assessment.scores[area.id as AreaType];
        });
      }

      return data;
    });

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          />
          <Legend verticalAlign="top" height={36} />

          {areaId ? (
            // Single area mode
            <Line
              type="monotone"
              dataKey={areaId}
              stroke={areas.find((a) => a.id === areaId)?.color || "#000"}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          ) : (
            // All areas mode
            areas.map((area) => (
              <Line
                key={area.id}
                type="monotone"
                dataKey={area.id}
                name={area.name}
                stroke={area.color}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
              />
            ))
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
