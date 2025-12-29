export const prerender = false;

import * as Engine from "@yysng/astro-boilerplate";

const { updateContent } = Engine;

export async function POST({ request, locals }) {
  try {
    const body = await request.json();
    const { section, content } = body;

    if (!section || !content) {
      return new Response(
        JSON.stringify({ error: "Missing section or content" }),
        { status: 400 }
      );
    }

    // ✅ Pass Cloudflare runtime env
    const result = await updateContent(section, content, locals.runtime.env);

    return new Response(
      JSON.stringify({ success: true, updated: section, result }),
      { status: 200 }
    );

  } catch (error) {
    console.error("AI Edit Error:", error);

    return new Response(
      JSON.stringify({ error: "Internal error", message: error.message }),
      { status: 500 }
    );
  }
}