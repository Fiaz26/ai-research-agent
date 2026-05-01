import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type GenerateBioInput, type BioResponse, type BiosListResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useBiosHistory() {
  return useQuery({
    queryKey: [api.bios.list.path],
    queryFn: async () => {
      const res = await fetch(api.bios.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bios history");
      const data = await res.json();
      return api.bios.list.responses[200].parse(data);
    },
  });
}

export function useGenerateBio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateBioInput) => {
      const validated = api.bios.generate.input.parse(data);
      const res = await fetch(api.bios.generate.path, {
        method: api.bios.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate bio");
      }
      
      const responseData = await res.json();
      return api.bios.generate.responses[200].parse(responseData);
    },
    onSuccess: () => {
      // Invalidate the history list to show the new bio
      queryClient.invalidateQueries({ queryKey: [api.bios.list.path] });
      toast({
        title: "✨ Bio Generated!",
        description: "Your new Instagram bio is ready to use.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
