module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-rational-order",
    "stylelint-config-prettier",
  ],
  plugins: ["stylelint-order"],
  ignoreFiles: [
    "**/*.js",
    "**/*.jsx",
    "**/*.tsx",
    "**/*.ts",
    "miniprogram/miniprogram_npm/**",
    "typings/**",
    "miniprogram/libs/**",
    "miniprogram/static/**",
    "miniprogram/components/**",
  ],
  rules: {
    "unit-no-unknown": [
      true,
      {
        ignoreUnits: "/rpx/",
      },
    ],
    "selector-type-no-unknown": [
      true,
      {
        ignoreTypes: ["/page/"],
      },
    ],
    "no-empty-source": null,
    "selector-class-pattern": null,
    "custom-property-pattern": null,
  },
};
