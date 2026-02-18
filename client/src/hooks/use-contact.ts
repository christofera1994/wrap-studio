import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertContactMessage, type ContactMessage } from "@shared/schema";

export function useSendMessage() {
  return useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const res = await fetch(api.contact.send.path, {
        method: api.contact.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }
      return api.contact.send.responses[200].parse(await res.json());
    },
  });
}

export function useAdminMessages() {
  return useQuery({
    queryKey: [api.contact.list.path],
    queryFn: async () => {
      const res = await fetch(api.contact.list.path);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.contact.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const url = buildUrl(api.contact.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.contact.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update message status");
      return api.contact.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.contact.list.path] });
    },
  });
}
