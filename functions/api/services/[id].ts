export async function onRequestDelete({ params, env }: any) {
  const id = params.id;

  const res = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/services?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  return new Response(await res.text(), { status: res.status });
}

export async function onRequestPatch({ request, params, env }: any) {
  const id = params.id;
  const body = await request.json();

  const res = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/services?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  return new Response(await res.text(), { status: res.status });
}
