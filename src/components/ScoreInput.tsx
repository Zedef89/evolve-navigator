
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

interface ScoreInputProps {
  value: number;
  onChange: (value: number) => void;
  areaColor?: string;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ 
  value, 
  onChange,
  areaColor = "#0284c7"
}) => {
  const [dragging, setDragging] = useState(false);

  const handleScoreChange = (newValue: number) => {
    // Ensure the value is between 1 and 10
    const clampedValue = Math.max(1, Math.min(10, newValue));
    onChange(clampedValue);
  };

  return (
    <div className="mt-2 mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor="score-input">Score (1-10)</Label>
        <div 
          className="text-lg font-medium px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: `${areaColor}15`, // 15% opacity
            color: areaColor 
          }}
        >
          {value}
        </div>
      </div>
      
      <div className="relative h-14 touch-none select-none">
        <motion.div 
          className="absolute inset-0 rounded-xl bg-gray-100"
          whileHover={{ scale: 1.01 }}
        />
        
        <motion.div 
          className="absolute h-full rounded-xl"
          style={{ 
            width: `${(value / 10) * 100}%`,
            backgroundColor: areaColor,
            opacity: dragging ? 0.8 : 0.6,
          }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        <motion.div
          className="absolute top-0 bottom-0 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md cursor-grab"
          style={{ 
            left: `calc(${(value / 10) * 100}% - 16px)`,
            border: `2px solid ${areaColor}`,
            top: "50%",
            marginTop: -16, // Using marginTop instead of y property
          }}
          drag="x"
          dragConstraints={{ left: -16, right: "calc(100% - 16px)" }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={(e, info) => {
            setDragging(false);
            // Cast to HTMLElement to access parentElement
            const element = e.currentTarget as HTMLElement;
            const containerWidth = element.parentElement?.clientWidth || 0;
            // Explicitly convert to number and round
            const newPosition = (info.point.x + 16) / containerWidth;
            const newValue = Math.round(newPosition * 10);
            // Ensure value is in the range 1-10 and is a number
            handleScoreChange(Math.max(1, Math.min(10, Number(newValue))));
          }}
          whileDrag={{ scale: 1.1 }}
          whileTap={{ cursor: "grabbing" }}
        />
        
        <div className="absolute inset-0 flex justify-between px-1 pt-10 text-xs text-gray-500">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div 
              key={num} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleScoreChange(num)}
            >
              <div 
                className="w-0.5 h-2 mb-1" 
                style={{ backgroundColor: num <= value ? areaColor : '#cbd5e1' }}
              />
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreInput;
