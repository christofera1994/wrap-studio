export async function onRequestPatch({ request, params, env }: any) {
  const id = params.id;
  const body = await request.json();

  const r = await fetch(
    `${env.VITE_SUPABASE_URL}/rest/v1/contact_messages?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    }
  );

  return new Response(await r.text(), {
    status: r.status,
    headers: { "content-type": "application/json" },
  });
}
