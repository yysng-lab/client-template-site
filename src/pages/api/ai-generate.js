export const prerender = false;

import OpenAI from "openai";
import { loadContent } from "@yysng/astro-boilerplate";

export async function POST({ request }) {
  try {
    const { instruction, section } = await request.json();

    if (!instruction || typeof instruction !== "string") {
      return new Response(JSON.stringify({ error: "Invalid instruction" }), { status: 400 });
    }

    // Create client INSIDE handler (Worker-safe)
    const client = new OpenAI({
      apiKey: import.meta.env.OPENAI_API_KEY
    });

    // ------------------------------
    // CTA GENERATION
    // ------------------------------
    if (section === "cta") {
      const prompt = `
You are an AI editor responsible for updating the CTA section of a website.

Rules:
- Output JSON only
- Follow the schema exactly
- Prefer partial updates
- Do not invent fields

Return JSON ONLY in this exact format:

{
  "heading": string,
  "description": string,
  "button": {
    "label": string,
    "href": string
  }
}

User instruction:
${instruction}
`;

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      });

      const result = JSON.parse(completion.choices[0].message.content);
      return new Response(JSON.stringify(result), { status: 200 });
    }

    // ------------------------------
    // HERO GENERATION
    // ------------------------------
    const heroPrompt = `
You are an AI editor responsible for updating the hero section of a website.

Rules:
- Output JSON only
- Follow the schema exactly
- Prefer partial updates
- Do not invent fields

Return JSON ONLY in this exact format:

{
  "title": string,
  "subtitle": string,
  "cta": {
    "label": string,
    "href": string
  }
}

User instruction:
${instruction}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: heroPrompt }],
      temperature: 0.7
    });

    const heroResult = JSON.parse(completion.choices[0].message.content);

    return new Response(JSON.stringify(heroResult), { status: 200 });

  } catch (err) {
    console.error("AI generate error:", err);
    return new Response(JSON.stringify({ error: "AI generation failed" }), { status: 500 });
  }
}
