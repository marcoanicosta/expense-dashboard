module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Optional: turn off prop-types if using React with hooks and no prop-types validation
    'react/react-in-jsx-scope': 'off', // Turn off the rule requiring React to be in scope
    'no-unused-vars': 'warn', // Set no-unused-vars to warn instead of error
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
