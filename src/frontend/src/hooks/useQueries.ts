import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useIncrementPageView() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      return actor.incrementPageView();
    },
  });
}

export function useGetPageViewCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["pageViewCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getPageViewCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  monthlyRevenue: string;
  budgetRange: string;
  growthGoals: string;
}

export function useSubmitLead() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: LeadFormData) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitLead(
        data.name,
        data.company,
        data.email,
        data.phone,
        data.monthlyRevenue,
        data.budgetRange,
        data.growthGoals,
      );
    },
  });
}
