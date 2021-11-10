module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  globals: {
    _gaq: "writable",
    chrome: "readonly",
    YT: "readonly",
  },
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  rules: {},
}
