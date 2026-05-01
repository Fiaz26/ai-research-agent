import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  api,
  type ResearchQAInput,
  type ResearchSummarizeInput,
  type ResearchReportInput,
  type ResearchListResponse,
  type ResearchResponse,
} from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useResearchHistory() {
  return useQuery<ResearchListResponse>({
    queryKey: [api.research.list.path],
    queryFn: async () => {
      const res = await fetch(api.research.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch research history");
      return res.json();
    },
  });
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }
  return res.json();
}

export function useResearchQA() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<ResearchResponse, Error, ResearchQAInput>({
    mutationFn: (data) =>
      postJson<ResearchResponse>(api.research.qa.path, api.research.qa.input.parse(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.research.list.path] });
    },
    onError: (error) => {
      toast({ title: "Couldn't answer that", description: error.message, variant: "destructive" });
    },
  });
}

export function useResearchSummarize() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<ResearchResponse, Error, ResearchSummarizeInput>({
    mutationFn: (data) =>
      postJson<ResearchResponse>(
        api.research.summarize.path,
        api.research.summarize.input.parse(data)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.research.list.path] });
    },
    onError: (error) => {
      toast({ title: "Couldn't summarize URL", description: error.message, variant: "destructive" });
    },
  });
}

export function useResearchReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<ResearchResponse, Error, ResearchReportInput>({
    mutationFn: (data) =>
      postJson<ResearchResponse>(
        api.research.report.path,
        api.research.report.input.parse(data)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.research.list.path] });
    },
    onError: (error) => {
      toast({ title: "Couldn't build report", description: error.message, variant: "destructive" });
    },
  });
}
