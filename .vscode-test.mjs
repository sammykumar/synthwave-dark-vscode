import { defineConfig } from "@vscode/test-cli";

export default defineConfig([
  {
    label: "coreTests",
    files: "out/test/core/*.test.js",
    workspaceFolder: "./examples",
    launchArgs: [
      "--disable-extensions",
      "--disable-workspace-trust",
      "--user-data-dir=/tmp/.vscode-test-core",
      // Add headless options for CI
      ...(process.env.CI ? ["--headless"] : []),
    ],
    keepAlive: true,
  },
  {
    label: "uiTests", 
    files: "out/test/ui/*.test.js",
    workspaceFolder: "./examples",
    launchArgs: [
      // Remove --disable-extensions to allow our extension to load
      "--disable-workspace-trust", 
      "--user-data-dir=/tmp/.vscode-test-ui",
      // Add headless options for CI
      ...(process.env.CI ? ["--headless"] : []),
    ],
    extensionDevelopmentPath: ".",
    keepAlive: true,
  }
]);
