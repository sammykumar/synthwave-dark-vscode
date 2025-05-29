#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🔄 SynthWave Dark - Force Reload Development");
  console.log("============================================");

  try {
    // Kill any running VS Code Insiders processes to ensure clean reload
    console.log("🛑 Stopping VS Code Insiders processes...");
    try {
      execSync("pkill -f 'Code - Insiders'", { stdio: "pipe" });
      // Give it a moment to fully close
      await sleep(2000);
    } catch (error) {
      // Process might not be running, that's fine
      console.log("ℹ️  No VS Code Insiders processes found");
    }

    // Clean any existing VSIX files
    console.log("🧹 Cleaning old VSIX files...");
    execSync("rm -f *.vsix", { stdio: "inherit" });

    // Uninstall extension (force remove)
    console.log("🗑️  Force uninstalling extension...");
    try {
      execSync(
        "code-insiders --uninstall-extension SammyKumar.synthwave-dark-vscode --force",
        { stdio: "pipe" }
      );
    } catch (error) {
      console.log("ℹ️  Extension not found or already uninstalled");
    }

    // Create fresh development package
    console.log("📦 Creating fresh development package...");
    execSync("vsce package --out synthwave-dark-dev.vsix", {
      stdio: "inherit",
    });

    // Install the fresh extension
    console.log("🚀 Installing fresh extension...");
    execSync(
      "code-insiders --install-extension synthwave-dark-dev.vsix --force",
      { stdio: "inherit" }
    );

    // Wait a moment for the installation to complete
    await sleep(1000);

    // Open VS Code Insiders
    console.log("🎵 Opening VS Code Insiders...");
    execSync("code-insiders .", { stdio: "inherit" });

    console.log("✅ Development reload complete!");
    console.log("");
    console.log("Your extension should now reflect the latest changes!");
    console.log(
      '💡 For faster development, consider using "npm run dev-live" with symlinks'
    );
  } catch (error) {
    console.error("❌ Reload failed:", error.message);
    process.exit(1);
  }
}

main();
