import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertGalleryItem, type GalleryItem } from "@shared/schema";

export function useGallery() {
  return useQuery({
    queryKey: [api.gallery.list.path],
    queryFn: async () => {
      const res = await fetch(api.gallery.list.path);
      if (!res.ok) throw new Error("Failed to fetch gallery items");
      return api.gallery.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: InsertGalleryItem) => {
      const res = await fetch(api.gallery.create.path, {
        method: api.gallery.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Failed to create gallery item");
      return api.gallery.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.gallery.list.path] });
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertGalleryItem>) => {
      const url = buildUrl(api.gallery.update.path, { id });
      const res = await fetch(url, {
        method: api.gallery.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update gallery item");
      return api.gallery.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.gallery.list.path] });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.gallery.delete.path, { id });
      const res = await fetch(url, { method: api.gallery.delete.method });
      if (!res.ok) throw new Error("Failed to delete gallery item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.gallery.list.path] });
    },
  });
}
