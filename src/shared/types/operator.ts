export interface Operator {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  points: number;
  count: number;
  kpi: number;
  average: number;
  stars?: number;
  rankChange?: number; // +1, -1, or null
  activityData?: number[];
  monthlyRankings?: number[]; // 12-month ranking history
  topMedalCount?: number; // How many times in top 3 this year
}

export interface OperatorGroup {
  id: string;
  title: string;
  operators: Operator[];
}

export type Quarter = '1' | '2' | '3' | '4';

export type MonthFilter = 'last-month' | 'current-month' | 'select-month';

export type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
