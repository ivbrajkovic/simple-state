module.exports = {
  plugins: ['@typescript-eslint', 'eslint-comments', 'promise', 'unicorn'],
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    ecmaFeatures: { jsx: true },
    files: ['*.ts', '*.tsx'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'linebreak-style': 0,
    // Airbnb prefers forEach
    'unicorn/no-array-for-each': 'off',
    // Common abbreviations are known and readable
    'unicorn/prevent-abbreviations': 'off',
    '@typescript-eslint/indent': 'off',
    // "import/no-unresolved": 0,
    // "import/no-extraneous-dependencies": 0,
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        // Allow `require()`
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
