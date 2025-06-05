import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  label: "unitTests",
  files: "out/test/**/*.test.js",
  workspaceFolder:
    "/Users/samkumar/Development/SK-Productions-LLC/synthwave-dark-vscode/examples",
  launchArgs: [
    "--disable-extensions",
    "--disable-workspace-trust",
    "--user-data-dir=/tmp/.vscode-test",
    // Add headless options for CI
    ...(process.env.CI ? ["--headless"] : []),
  ],
  // mocha: {
  //   globalSetup: "./out/test/globalSetup.js",
  //   globalTeardown: "./out/test/globalTeardown.js",
  // },
  keepAlive: true, // This keeps the window open
});
