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
    createdAt: x.created_at,
    title: x.title,
    description: x.description,
    imageUrl: x.image_url,
    isActive: x.is_active,
    sortOrder: x.sort_order,
  }));

  return new Response(JSON.stringify(mapped), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
