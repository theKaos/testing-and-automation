import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    // Prefixed with "**/" so a stray nested build output (e.g. a duplicated
    // "storefront/.next") is ignored too, not just one directly at the project root.
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "next-env.d.ts",
    "**/coverage/**",
    "public/mockServiceWorker.js",
    "**/playwright-report/**",
    "**/test-results/**",
    "**/blob-report/**"
  ]),
]);

export default eslintConfig;
