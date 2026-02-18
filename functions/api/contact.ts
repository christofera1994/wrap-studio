export async function onRequestPost({ request, env }: any) {
  try {
    const { name, email, message } = await request.json();

    // TODO: ovde kasnije ubaci Resend slanje maila
    return new Response(
      JSON.stringify({ ok: true, received: { name, email, message } }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message ?? "Bad Request" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }
}
