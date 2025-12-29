import { loadContent as coreLoad } from "@yysng/astro-boilerplate";

export async function loadContentSafe(key, env) {
  try {
    return await coreLoad(key, env);
  } catch (err) {
    console.warn(`[AI-Edit] KV missing for "${key}", falling back to local content`);
    return await coreLoad(key, {});   // force local fallback
  }
}