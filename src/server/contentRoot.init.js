import { setContentRoot } from "@yysng/astro-boilerplate";

// Only configure content root when running in Node (local dev)
if (typeof process !== "undefined" && process.versions?.node) {
  setContentRoot(new URL("../content", import.meta.url).pathname);
}