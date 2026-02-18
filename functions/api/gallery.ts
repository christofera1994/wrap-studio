export async function onRequestGet({ env }: any) {
  const r = await fetch(
    `${env.VITE_SUPABASE_URL}/rest/v1/gallery_items?select=*&is_active=eq.true&order=sort_order.asc`,
    {
      headers: {
        apikey: env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
      },
    }
  );

  const rows = await r.json();

  const mapped = (rows || []).map((x: any) => ({
    id: x.id,
    title: x.title,
    description: x.description,
    imageUrl: x.image_url,     // 👈 ključna stvar
    sortOrder: x.sort_order,   // 👈
    isActive: x.is_active,     // 👈
    createdAt: x.created_at ?? null,
  }));

  return new Response(JSON.stringify(mapped), {
    status: r.status,
    headers: { "content-type": "application/json" },
  });
}
