export const prerender = false;

import { handleGenerate } from "@yysng/ai-edit-engine/server";

export async function POST({ request, locals }) {
  return handleGenerate(request, locals.runtime.env);
}