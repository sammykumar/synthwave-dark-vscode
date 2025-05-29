#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { downloadAndUnzipVSCode, runTests } = require("@vscode/test-electron");

console.log("🧪 SynthWave Dark - Fresh Test Environment");
console.log("==========================================");

async function main() {
  try {
    // Clean any existing packages and test data
    console.log("🧹 Cleaning test environment...");
    execSync("rm -f *.vsix && rm -rf .vscode-test-*", { stdio: "inherit" });

    // Create a development package
    console.log("📦 Creating test package...");
    execSync("npx vsce package --out synthwave-dark-test.vsix", {
      stdio: "inherit",
    });

    console.log("⬇️  Setting up fresh VS Code test instance...");

    // The folder containing the Extension Manifest package.json
    const extensionDevelopmentPath = path.resolve(__dirname, "../");

    // The path to test runner
    const extensionTestsPath = path.resolve(
      __dirname,
      "../src/test/suite/index"
    );

    // Create a unique user data directory for testing
    const sessionId = Date.now();
    const userDataDir = path.resolve(
      __dirname,
      `../.vscode-test-data-${sessionId}`
    );

    // Run tests in the fresh instance
    await runTests({
      vscodeExecutablePath: await downloadAndUnzipVSCode(),
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        "--disable-extensions",
        "--new-window",
        "--disable-telemetry",
        "--disable-crash-reporter",
        "--no-cached-extensions",
        `--user-data-dir=${userDataDir}`,
      ],
    });

    console.log("✅ Tests completed in fresh environment!");
    console.log("");
    console.log("💡 Test data will be cleaned up automatically");

    // Clean up test data
    setTimeout(() => {
      try {
        if (fs.existsSync(userDataDir)) {
          fs.rmSync(userDataDir, { recursive: true, force: true });
        }
        if (fs.existsSync("synthwave-dark-test.vsix")) {
          fs.unlinkSync("synthwave-dark-test.vsix");
        }
      } catch (error) {
        console.log("ℹ️  Manual cleanup may be needed for test files");
      }
    }, 5000);
  } catch (error) {
    console.error("❌ Test environment failed:", error.message);
    process.exit(1);
  }
}

main();
