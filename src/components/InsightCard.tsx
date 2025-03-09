
import React from "react";
import { motion } from "framer-motion";
import { LightbulbIcon } from "lucide-react";

interface InsightCardProps {
  insight: string;
  index: number;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-4 flex space-x-3 shadow-sm"
    >
      <div className="flex-shrink-0 mt-1">
        <div className="bg-amber-100 rounded-full p-2">
          <LightbulbIcon className="w-4 h-4 text-amber-500" />
        </div>
      </div>
      <p className="text-sm text-gray-600">{insight}</p>
    </motion.div>
  );
};

export default InsightCard;
