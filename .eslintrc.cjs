/*
 * Eslint config file
 * Documentation: https://eslint.org/docs/user-guide/configuring/
 * Install the Eslint extension before using this feature.
 */
module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  // ecmaFeatures: {
  //   modules: true,
  // },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  globals: {
    wx: true,
    App: true,
    Page: true,
    getCurrentPages: true,
    getApp: true,
    Component: true,
    requirePlugin: true,
    requireMiniProgram: true,
    Behavior: true,
    WXWebAssembly: true,
  },
  plugins: ["prettier", "import"],
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  rules: {
    "no-unused-vars": "warn",
    "import/newline-after-import": "error",
    "import/first": "error",
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["@", "./miniprogram"],
          ["@vant", "./miniprogram/miniprogram_npm/@vant"],
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
