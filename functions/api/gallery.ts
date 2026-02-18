export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, route: "gallery GET" }), {
    headers: { "content-type": "application/json" },
  });
}
