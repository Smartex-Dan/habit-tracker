import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const DASHBOARD_CHARTS_KEY = ["dashboard-charts"] as const;

export function useDashboardCharts() {
  return useQuery({
    queryKey: DASHBOARD_CHARTS_KEY,
    queryFn: api.dashboardCharts.get,
  });
}