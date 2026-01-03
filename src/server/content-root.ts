import { setContentRoot } from "@yysng/astro-boilerplate";

export function initContentRoot() {
  const root = new URL("../content", import.meta.url).pathname;
  setContentRoot(root);
}