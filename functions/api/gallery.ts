const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

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

  return json(mapped, 200);
}

export async function onRequestPost({ request, env }: any) {
  const body = await request.json();

  const r = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/gallery_items`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      title: body.title,
      description: body.description,
      image_url: body.imageUrl,
      sort_order: body.sortOrder ?? 999,
      is_active: body.isActive ?? true,
    }),
  });

  const created = await r.json();
  const x = created?.[0];
  if (!x) return json({ message: "Create failed" }, r.status);

  return json(
    {
      id: x.id,
      createdAt: x.created_at,
      title: x.title,
      description: x.description,
      imageUrl: x.image_url,
      isActive: x.is_active,
      sortOrder: x.sort_order,
    },
    201
  );
}
