// src/hooks/useMonthlyRevenue.ts
import { useQuery } from "@tanstack/react-query";
import revenueClient from "@/services/RevenueService";
import { MonthlyRevenue } from "@/entities/MonthlyRevenue";

export function useMonthlyRevenue() {
  return useQuery<MonthlyRevenue[]>({
    queryKey: ["monthlyRevenue"],
    queryFn: () => revenueClient.getMonthlyRevenue(),
    staleTime: 1000 * 60,
  });
}
