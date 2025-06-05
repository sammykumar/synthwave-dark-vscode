import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  label: "unitTests",
  files: "out/test/**/*.test.js",
  workspaceFolder:
    "/Users/samkumar/Development/SK-Productions-LLC/synthwave-dark-vscode/examples",
  userDataDir: "/tmp/vsc-test-data",
  launchArgs: [
    "--disable-extensions",
    "--disable-workspace-trust",
    // Add headless options for CI
    ...(process.env.CI ? ["--headless"] : []),
  ],
  // mocha: {
  //   ui: "tdd",
  //   timeout: 20000,
  // },
  keepAlive: true, // This keeps the window open
});
