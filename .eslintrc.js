module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: { jsx: true },
    files: ["*.ts", "*.tsx"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  ignorePatterns: ["/lib/**/*", "*config.ts"],
  plugins: ["react", "@typescript-eslint"],
  rules: {
    quotes: ["error", "double"],
    "linebreak-style": 0,
    "@typescript-eslint/quotes": 0,
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": 0,
  },
  settings: {
    react: {
      version: "latest",
    },
  },
};
