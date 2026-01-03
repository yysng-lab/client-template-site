import { updateContent } from "@yysng/astro-boilerplate";

export async function POST({ request }) {
  let body;

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  const { section, content } = body || {};

  if (!section || !content) {
    return new Response(JSON.stringify({ error: "Missing section or content" }), { status: 400 });
  }

  try {
    const result = await updateContent(section, content);
    return Response.json({ ok: true, result });
  } catch (err) {
    console.error("AI Edit failed:", err);
    return new Response(
      JSON.stringify({ error: "Write failed", message: err.message }),
      { status: 500 }
    );
  }
}