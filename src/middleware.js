import "./server/contentRoot.init.js";

export async function onRequest({ request, locals }, next) {
  return next();
}