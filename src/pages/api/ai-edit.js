export const prerender = false;

import path from "path";
import {
  setContentRoot,
  updateContent
} from "@yysng/astro-boilerplate";

// Configure content root ONCE per server runtime
setContentRoot(path.resolve(process.cwd(), "src/content"));

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

    // 🔒 All writes go through the boilerplate guardrail
    await updateContent(section, content);

    return new Response(
      JSON.stringify({
        success: true,
        updated: section
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