import { jestConfig } from "@actions-kit/dev";

export default jestConfig({
  testMatch: ["**/*.test.ts", "!**/helper.test.ts"],
});
