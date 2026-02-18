export async function onRequestGet() {
  // privremeno: samo da proverimo da endpoint radi
  return new Response(JSON.stringify({ ok: true, route: "services GET" }), {
    headers: { "content-type": "application/json" },
  });
}
