
import { format, subDays, subWeeks } from "date-fns";

export type AreaType = "tech" | "personal" | "business" | "social";

export interface Area {
  id: AreaType;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export interface Assessment {
  id: string;
  date: Date;
  scores: Record<AreaType, number>;
  notes: Record<AreaType, string>;
}

export const areas: Area[] = [
  {
    id: "tech",
    name: "Technology & Scientific Knowledge",
    color: "#0A84FF",
    icon: "cpu",
    description: "Track your growth in technical skills and scientific understanding."
  },
  {
    id: "personal",
    name: "Personal Growth",
    color: "#30D158", 
    icon: "heart",
    description: "Monitor your personal development, wellbeing, and mindfulness."
  },
  {
    id: "business",
    name: "Business & Finance",
    color: "#FF9F0A",
    icon: "briefcase",
    description: "Evaluate your professional progress and financial literacy."
  },
  {
    id: "social",
    name: "Intimate & Social Relationships",
    color: "#FF375F",
    icon: "users",
    description: "Assess the quality of your relationships and social connections."
  }
];

const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 6) + 5; // Random score between 5-10
};

const generateAssessments = (count: number): Assessment[] => {
  const assessments: Assessment[] = [];
  
  for (let i = 0; i < count; i++) {
    assessments.push({
      id: `assessment-${i}`,
      date: subWeeks(new Date(), i),
      scores: {
        tech: generateRandomScore(),
        personal: generateRandomScore(),
        business: generateRandomScore(),
        social: generateRandomScore(),
      },
      notes: {
        tech: "Learning new frameworks and technologies.",
        personal: "Working on mindfulness and exercise routine.",
        business: "Exploring new business opportunities.",
        social: "Building deeper connections with friends and family.",
      }
    });
  }
  
  return assessments.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const mockAssessments = generateAssessments(12);

export const calculateAverageScore = (assessment: Assessment): number => {
  const scores = Object.values(assessment.scores);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

export const getAreaTrend = (
  assessments: Assessment[],
  areaId: AreaType,
  count: number = 4
): { increasing: boolean; percentage: number } => {
  if (assessments.length < 2) {
    return { increasing: true, percentage: 0 };
  }

  const recentAssessments = assessments.slice(0, count);
  const oldestScore = recentAssessments[recentAssessments.length - 1].scores[areaId];
  const newestScore = recentAssessments[0].scores[areaId];
  
  const difference = newestScore - oldestScore;
  const percentage = Math.round((difference / oldestScore) * 100);
  
  return {
    increasing: difference >= 0,
    percentage: Math.abs(percentage),
  };
};

export const getAreaColor = (areaId: AreaType): string => {
  const area = areas.find(a => a.id === areaId);
  return area ? area.color : "#000000";
};

export const getChartData = (assessments: Assessment[], limit: number = 8) => {
  const limitedAssessments = assessments.slice(0, limit).reverse();
  
  return {
    labels: limitedAssessments.map(a => format(a.date, "MMM d")),
    datasets: areas.map(area => ({
      label: area.name,
      data: limitedAssessments.map(a => a.scores[area.id]),
      borderColor: area.color,
      backgroundColor: `${area.color}33`, // Add transparency
      tension: 0.3,
    })),
  };
};

export const getInsights = (assessments: Assessment[]): string[] => {
  if (assessments.length < 2) {
    return ["Start tracking your growth to receive personalized insights."];
  }

  const insights: string[] = [];
  const latestAssessment = assessments[0];
  const previousAssessment = assessments[1];

  for (const area of areas) {
    const latestScore = latestAssessment.scores[area.id];
    const previousScore = previousAssessment.scores[area.id];
    const difference = latestScore - previousScore;

    if (difference >= 2) {
      insights.push(`Great progress in ${area.name}! You've improved by ${difference} points.`);
    } else if (difference <= -2) {
      insights.push(`Your ${area.name} score has decreased by ${Math.abs(difference)} points. Consider focusing on this area.`);
    }
  }

  // Add more generic insights
  if (insights.length === 0) {
    const averageScore = calculateAverageScore(latestAssessment);
    if (averageScore >= 8) {
      insights.push("You're doing well across all areas. Keep up the great work!");
    } else if (averageScore <= 6) {
      insights.push("Consider setting specific goals for improvement in your lower-scoring areas.");
    } else {
      insights.push("You're making steady progress. Focus on consistency for continued growth.");
    }
  }

  return insights;
};

export const areaQuestions: Record<AreaType, string[]> = {
  tech: [
    "How much have you learned about new technologies this week?",
    "Have you applied your technical knowledge to solve any problems?",
    "Have you shared your technical expertise with others?",
    "How confident do you feel with your current technical skills?",
  ],
  personal: [
    "How well have you maintained your physical health?",
    "Have you practiced mindfulness or self-reflection?",
    "Have you pursued any personal hobbies or interests?",
    "How would you rate your overall mental wellbeing?",
  ],
  business: [
    "Have you made progress toward your professional goals?",
    "How effectively have you managed your finances?",
    "Have you identified new opportunities for growth?",
    "How satisfied are you with your work-life balance?",
  ],
  social: [
    "How much quality time have you spent with loved ones?",
    "Have you had meaningful conversations with friends or family?",
    "Have you expanded your social network?",
    "How supported do you feel by your social circle?",
  ],
};
