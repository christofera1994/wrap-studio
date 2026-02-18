export async function onRequestPost(context) {
  try {
    const body = await context.request.json()

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Contact Form <onboarding@resend.dev>",
        to: context.env.MY_EMAIL,
        subject: "Nova poruka sa sajta",
        html: `
          <h2>Nova poruka</h2>
          <p><b>Ime:</b> ${body.name}</p>
          <p><b>Email:</b> ${body.email}</p>
          <p><b>Poruka:</b><br/>${body.message}</p>
        `
      })
    })

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500
    })
  }
}
