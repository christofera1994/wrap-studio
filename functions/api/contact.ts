export async function onRequestPost({ request, env }: any) {
  try {
    const input = await request.json();

    // (1) opcionalno: validacija da bar ima email i message
    if (!input?.email || !input?.message) {
      return new Response(
        JSON.stringify({ message: "Email i poruka su obavezni." }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // (2) upis u bazu - PRESKAČEMO za sad (može posle)
    // (3) slanje maila preko Resend REST API (radi u Cloudflare)
    if (env.RESEND_API_KEY && env.MY_EMAIL) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Car Wrap Studio <onboarding@resend.dev>",
          to: env.MY_EMAIL,
          subject: `Nova poruka od: ${input.name || "Neko"}`,
          html: `
            <p><strong>Ime:</strong> ${input.name || ""}</p>
            <p><strong>Email:</strong> ${input.email || ""}</p>
            <p><strong>Poruka:</strong></p>
            <p>${input.message || ""}</p>
          `,
        }),
      });

      if (!r.ok) {
        const txt = await r.text();
        console.error("Resend failed:", txt);
        // NE rušimo celu stvar, samo logujemo (isto kao tvoj Express)
      }
    }

    // ✅ Ovo je bitno: vrati format koji frontend očekuje
    return new Response(
      JSON.stringify({ message: "Poruka uspešno poslata!" }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ message: "Došlo je do greške prilikom slanja poruke." }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
}
