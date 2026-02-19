export async function onRequestPost({ request, env }: any) {
  try {
    const { name, email, message } = await request.json();

    if (!env.RESEND_API_KEY || !env.MY_EMAIL) {
      return new Response(
        JSON.stringify({ ok: false, message: "Missing RESEND_API_KEY or MY_EMAIL" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Wrap Studio <onboarding@resend.dev>",
      to: env.MY_EMAIL,
      subject: `Nova poruka: ${name}`,
      reply_to: email,
      html: `
        <p><b>Ime:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Poruka:</b></p>
        <p>${message}</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, message: e?.message ?? "Send failed" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
