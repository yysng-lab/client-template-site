import path from "path";
import { setContentRoot } from "@yysng/astro-boilerplate";

setContentRoot(
  path.resolve(process.cwd(), "src/content")
);