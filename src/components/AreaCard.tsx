
import React from "react";
import { motion } from "framer-motion";
import { AreaType, Area, Assessment, getAreaTrend } from "@/lib/mockData";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AreaCardProps {
  area: Area;
  assessments: Assessment[];
  onClick?: () => void;
}

const AreaCard: React.FC<AreaCardProps> = ({ area, assessments, onClick }) => {
  const navigate = useNavigate();
  const latestAssessment = assessments.length > 0 ? assessments[0] : null;
  const score = latestAssessment ? latestAssessment.scores[area.id as AreaType] : 0;
  const trend = assessments.length > 1 ? getAreaTrend(assessments, area.id as AreaType) : null;

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getIconComponent = () => {
    const iconName = area.icon.charAt(0).toUpperCase() + area.icon.slice(1);
    // Use dynamic access with type assertion to get the icon component
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/area/${area.id}`);
    }
  };

  return (
    <motion.div
      className="glass-morphism rounded-xl overflow-hidden cursor-pointer"
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      variants={variants}
      onClick={handleClick}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`text-white p-2 rounded-lg`}
            style={{ backgroundColor: area.color }}
          >
            {getIconComponent()}
          </div>
          {trend && (
            <div className="flex items-center text-sm">
              {trend.increasing ? (
                <LucideIcons.TrendingUp className="text-green-500 w-4 h-4 mr-1" />
              ) : (
                <LucideIcons.TrendingDown className="text-red-500 w-4 h-4 mr-1" />
              )}
              <span className={trend.increasing ? "text-green-500" : "text-red-500"}>
                {trend.percentage}%
              </span>
            </div>
          )}
        </div>

        <h3 className="font-medium mb-1">{area.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{area.description}</p>

        <div className="mt-auto flex justify-between items-center">
          <div className="text-2xl font-semibold">{score ? score : "-"}/10</div>
          <LucideIcons.ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </motion.div>
  );
};

export default AreaCard;
