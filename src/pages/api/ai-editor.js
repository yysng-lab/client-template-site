export const prerender = false;

import { handleUI } from "@yysng/ai-edit-engine/server";

export async function GET() {
  return handleUI();
}