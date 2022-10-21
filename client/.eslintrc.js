/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ["eslint:recommended", "airbnb", "prettier", "plugin:@typescript-eslint/recommended"],
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  globals: {
    DEV: true,
  },
  plugins: ["json", "prettier", "import", "@typescript-eslint", "unused-imports"],
  rules: {
    "@typescript-eslint/no-explicit-any": [
      "error",
      {
        fixToUnknown: true,
        ignoreRestArgs: false,
      },
    ],
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-use-before-define": "error",

    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/destructuring-assignment": 0,
    "react/prop-types": 0,
    "react/prefer-stateless-function": 0,
    "react/react-in-jsx-scope": 0,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-curly-newline": 0, // it conflicts with prettier
    "react/jsx-wrap-multilines": ["error", { arrow: true, return: true, declaration: true }],
    "react/function-component-definition": [2, { namedComponents: "arrow-function" }],

    "prettier/prettier": ["error"],

    "no-shadow": "off",
    "no-use-before-define": "off",
    "require-await": "error",
    "spaced-comment": ["error", "always"],
    "unused-imports/no-unused-imports": "error",
    "no-underscore-dangle": "off",
    "no-unused-expressions": ["error", { allowShortCircuit: true }],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-alert": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-plusplus": "off",
    "class-methods-use-this": "off",
    "max-len": [
      "warn",
      {
        code: 120,
        tabWidth: 2,
        comments: 1000,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: ["./tsconfig.json"],
      },
    },
  },
};
