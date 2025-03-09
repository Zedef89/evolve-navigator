export const areas = [
  { 
    id: 'tech', 
    name: 'Technology & Scientific Knowledge', 
    color: '#0ea5e9',
    icon: 'laptop',
    description: 'Track your growth in technical skills and scientific understanding'
  },
  { 
    id: 'personal', 
    name: 'Personal Growth', 
    color: '#22c55e',
    icon: 'heart',
    description: 'Monitor your personal development and wellbeing'
  },
  { 
    id: 'business', 
    name: 'Business & Finance', 
    color: '#f59e0b',
    icon: 'briefcase',
    description: 'Evaluate your professional progress and financial literacy'
  },
  { 
    id: 'social', 
    name: 'Intimate & Social Relationships', 
    color: '#ec4899',
    icon: 'users',
    description: 'Track your relationships and social connections'
  }
];

export type AreaType = typeof areas[number]['id'];

interface Assessment {
  id: string;
  date: string;
  scores: Record<AreaType, number>;
  notes: Record<AreaType, string>;
}

export const getAreaTrend = (assessments: Assessment[], areaId: AreaType) => {
  if (assessments.length < 2) return null;
  
  const recentScores = assessments
    .slice(0, 4)
    .map(a => a.scores[areaId])
    .reverse();
  
  const firstScore = recentScores[0];
  const lastScore = recentScores[recentScores.length - 1];
  const increasing = lastScore > firstScore;
  const percentage = Math.abs(((lastScore - firstScore) / firstScore) * 100).toFixed(1);
  
  return { increasing, percentage };
};