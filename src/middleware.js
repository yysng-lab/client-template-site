import { initContentRoot } from "./server/content-root.ts";

export async function onRequest(context, next) {
  initContentRoot();
  return next();
}