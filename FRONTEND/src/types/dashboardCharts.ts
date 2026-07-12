import type { HeatmapEntry } from "./habit";

export interface WeeklyProgressEntry {
  date: string; // "YYYY-MM-DD"
  day_label: string; // "Mon", "Tue", etc.
  completed: number;
  total: number;
}

export interface DashboardCharts {
  heatmap: HeatmapEntry[];
  weekly: WeeklyProgressEntry[];
}