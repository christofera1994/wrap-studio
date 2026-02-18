export async function onRequestGet({ env }: any) {
  const r = await fetch(
    `${env.VITE_SUPABASE_URL}/rest/v1/services?select=*&is_active=eq.true&order=sort_order.asc`,
    {
      headers: {
        apikey: env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
      },
    }
  );

  return new Response(await r.text(), {
    status: r.status,
    headers: { "content-type": "application/json" },
  });
}
