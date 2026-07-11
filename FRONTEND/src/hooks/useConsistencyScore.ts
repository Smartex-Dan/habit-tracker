import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const CONSISTENCY_SCORE_KEY = ["consistency-score"] as const;

export function useConsistencyScore() {
  return useQuery({
    queryKey: CONSISTENCY_SCORE_KEY,
    queryFn: api.consistencyScore.get,
  });
}