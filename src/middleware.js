import "./server/contentRoot.init.js";

export async function onRequest({ request }, next) {
  return next();
}