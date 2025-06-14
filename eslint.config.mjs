import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"], // Chỉ áp dụng cho tệp TypeScript,
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Tắt quy tắc no-explicit-any
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "none" },
      ], // Cho phép biến bắt đầu bằng _ không bị cảnh báo
      "prefer-const": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
    extends: ["plugin:@tanstack/query/recommended"],
  },
];

export default eslintConfig;
