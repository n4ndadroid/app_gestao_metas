
export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface LogEntry {
  date: string; // ISO string for the completion date
}

export interface Habit {
  id: string;
  name: string;
  frequency: Frequency;
  createdAt: string; // ISO string
  logs: LogEntry[];
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  currentProgress: number;
  unit: string; // e.g., 'pages', 'kg', 'commits'
  createdAt: string; // ISO string
}

export type Item = Habit | Goal;
export type ItemType = 'habit' | 'goal';
