module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", "node_modules", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
    // This codebase does not use prop-types anywhere; enabling it would flag
    // every existing component.
    "react/prop-types": "off",
    // Vite uses the automatic JSX runtime, so `import React` is not required —
    // but most files in this repo carry it. Allow both styles.
    "no-unused-vars": ["error", { varsIgnorePattern: "^React$" }],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
