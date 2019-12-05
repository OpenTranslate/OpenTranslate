const path = require("path");

module.exports = {
  extends: [
    path.join(__dirname, "../../.eslintrc"),
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  }
};
