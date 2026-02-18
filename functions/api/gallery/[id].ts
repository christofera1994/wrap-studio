function json(resBody: any, status = 200) {
  return new Response(JSON.stringify(resBody), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function onRequestPatch({ request, params, env }: any) {
  const id = params.id;
  const body = await request.json();

  const r = await fetch(
    `${env.VITE_SUPABASE_URL}/rest/v1/gallery_items?id=eq.${encodeURIComponent(id)}`,
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
        ...(body.imageUrl !== undefined ? { image_url: body.imageUrl } : {}),
        ...(body.sortOrder !== undefined ? { sort_order: body.sortOrder } : {}),
        ...(body.isActive !== undefined ? { is_active: body.isActive } : {}),
      }),
    }
  );

  const txt = await r.text();
  return new Response(txt, {
    status: r.status,
    headers: { "content-type": "application/json" },
  });
}

export async function onRequestDelete({ params, env }: any) {
  const id = params.id;

  const r = await fetch(
    `${env.VITE_SUPABASE_URL}/rest/v1/gallery_items?id=eq.${encodeURIComponent(id)}`,
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
