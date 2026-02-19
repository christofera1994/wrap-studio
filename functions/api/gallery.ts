import { createClient } from "@supabase/supabase-js";

export async function onRequestGet({ env }: any) {
  const supabase = createClient(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_ANON_KEY,
  );

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data ?? []), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
