const json = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function onRequestPatch({ request, params, env }: any) {
  const id = params.id;
  const body = await request.json();

  const r = await fetch(
    `${env.VITE_SUPABASE_URL}/rest/v1/services?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.price !== undefined ? { price: body.price } : {}),
        ...(body.sortOrder !== undefined ? { sort_order: body.sortOrder } : {}),
        ...(body.isActive !== undefined ? { is_active: body.isActive } : {}),
      }),
    }
  );

  const updated = await r.json();
  const x = updated?.[0];
  if (!x) return json({ message: "Update failed" }, r.status);

  return json({
    id: x.id,
    createdAt: x.created_at,
    title: x.title,
    description: x.description,
    price: x.price,
    isActive: x.is_active,
    sortOrder: x.sort_order,
  });
}

export async function onRequestDelete({ params, env }: any) {
  const id = params.id;

  const r = await fetch(
    `${env.VITE_SUPABASE_URL}/rest/v1/services?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );

  if (!r.ok) return json({ message: "Delete failed" }, r.status);
  return json({ ok: true }, 200);
}
