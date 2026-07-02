import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { deserialize, serialize } from "node:v8";
import tseslint from "typescript-eslint";

if (typeof globalThis.structuredClone !== "function") {
  globalThis.structuredClone = (value) => deserialize(serialize(value));
}

export default defineConfig([
  globalIgnores(["dist", "src/components/ui/**"]),
  {
    files: ["vite.config.js"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "no-console": "warn",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreClassWithStaticInitBlock: true,
          vars: "all",
          varsIgnorePattern: "^[A-Z_]",
        },
      ],
    },
  },
]);
