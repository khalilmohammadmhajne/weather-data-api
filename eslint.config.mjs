import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Enable CommonJS module system
      globals: {
        ...globals.node, // Include Node.js globals like `process`, `__dirname`, etc.
      },
    },
  },
  pluginJs.configs.recommended, // Use ESLint's recommended rules
];
