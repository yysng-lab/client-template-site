export const prerender = false;

import { updateContent } from "@yysng/astro-boilerplate";

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { section, content } = body;

    if (!section || !content) {
      return new Response(
        JSON.stringify({ error: "Missing section or content" }),
        { status: 400 }
      );
    }

    // Edge-safe: in-memory update only
    const result = await updateContent(section, content);

    return new Response(
      JSON.stringify({
        success: true,
        updated: section,
        result
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("AI Edit Error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal error",
        message: error.message
      }),
      { status: 500 }
    );
  }
}