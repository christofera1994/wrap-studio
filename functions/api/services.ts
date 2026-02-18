function json(resBody: any, status = 200) {
  return new Response(JSON.stringify(resBody), {
    status,
    headers: { "content-type": "application/json" },
  });
}

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

  const rows = await r.json();

  const mapped = (rows || []).map((x: any) => ({
    id: x.id,
    title: x.title,
    description: x.description,
    price: x.price,
    sortOrder: x.sort_order,
    isActive: x.is_active,
    createdAt: x.created_at ?? null,
  }));

  return json(mapped, r.status);
}

export async function onRequestPost({ request, env }: any) {
  const body = await request.json();

  const r = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/services`, {
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
      price: body.price,
      sort_order: body.sortOrder ?? body.sort_order ?? 999,
      is_active: body.isActive ?? body.is_active ?? true,
    }),
  });

  const txt = await r.text();
  return new Response(txt, {
    status: r.status,
    headers: { "content-type": "application/json" },
  });
}
