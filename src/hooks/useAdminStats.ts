// src/hooks/useAdminStats.ts
import { useQuery } from "@tanstack/react-query";
import adminClient from "@/services/AdminService";
import { AdminStats } from "@/entities/AdminStats";

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: () => adminClient.getStats(),
    staleTime: 1000 * 60,
  });
}

