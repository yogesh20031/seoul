import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node24",
  platform: "node",
  clean: true,
  sourcemap: true,
  // Bundle the workspace package so Render only needs dist/ plus node_modules.
  noExternal: ["@seoul/shared"],
});
