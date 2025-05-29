#!/usr/bin/env node

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const {
  downloadAndUnzipVSCode,
  resolveCliArgsFromVSCodeExecutablePath,
} = require("@vscode/test-electron");

console.log("🎵 SynthWave Dark - Fresh Development Instance");
console.log("==============================================");

async function main() {
  try {
    // Clean any existing test instances and packages
    console.log("🧹 Cleaning previous test instances...");
    execSync("rm -f *.vsix && rm -rf .vscode-test-*", { stdio: "inherit" });

    // Create a development package
    console.log("📦 Creating development package...");
    execSync("npx vsce package --out synthwave-dark-dev.vsix", {
      stdio: "inherit",
    });

    // Download a fresh VS Code instance
    console.log("⬇️  Downloading fresh VS Code instance...");
    const vscodeExecutablePath = await downloadAndUnzipVSCode();

    // Get the CLI arguments for the downloaded VS Code
    const [cliPath, ...args] =
      resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

    // Create a unique user data directory for this session
    const sessionId = Date.now();
    const userDataDir = path.resolve(
      __dirname,
      `../.vscode-test-data-${sessionId}`
    );

    console.log("🚀 Starting fresh VS Code instance...");
    console.log(`📂 User data directory: ${userDataDir}`);
    console.log(`🎯 VS Code executable: ${vscodeExecutablePath}`);

    // Install the extension in the fresh instance
    console.log("🔌 Installing extension in fresh instance...");
    execSync(
      `"${cliPath}" --user-data-dir="${userDataDir}" --install-extension synthwave-dark-dev.vsix`,
      { stdio: "inherit" }
    );

    // Launch VS Code with the extension pre-installed
    console.log("✨ Launching development environment...");
    const vscode = spawn(
      cliPath,
      [
        "--user-data-dir",
        userDataDir,
        "--disable-telemetry",
        "--disable-crash-reporter",
        "--no-cached-extensions",
        "--enable-proposed-api",
        "SammyKumar.synthwave-dark-vscode",
        ".",
      ],
      {
        stdio: "inherit",
        detached: true,
      }
    );

    vscode.unref(); // Allow the parent process to exit

    console.log("✅ Fresh development instance started!");
    console.log("");
    console.log("🎨 Next steps:");
    console.log(
      "1. Apply the theme: Preferences > Color Theme > SynthWave Dark"
    );
    console.log(
      "2. Run 'Synthwave Dark: Enable Neon Dreams' command for glow effects"
    );
    console.log(
      "3. Make changes to your code and use F5 to test in Extension Development Host"
    );
    console.log("");
    console.log(
      "💡 This instance is completely isolated from your main VS Code installation"
    );
    console.log(`🗑️  Run 'npm run dev:clean' to remove test data when done`);
  } catch (error) {
    console.error("❌ Failed to start development instance:", error.message);
    process.exit(1);
  }
}

main();
