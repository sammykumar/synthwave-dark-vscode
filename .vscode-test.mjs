import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  label: "unitTests",
  files: "out/test/**/*.test.js",
  workspaceFolder:
    "/Users/samkumar/Development/SK-Productions-LLC/synthwave-dark-vscode",
  userDataDir: "/tmp/vsc-test-data",
});
