#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🎵 SynthWave Dark - Development Install");
console.log("=====================================");

try {
  // Clean any existing VSIX files
  console.log("🧹 Cleaning old VSIX files...");
  execSync("rm -f *.vsix", { stdio: "inherit" });

  // Create development package with fixed name
  console.log("📦 Creating development package...");
  execSync("vsce package --out synthwave-dark-dev.vsix", { stdio: "inherit" });

  // Check if VS Code Insiders is available
  console.log("🔍 Checking for VS Code Insiders...");
  try {
    execSync("which code-insiders", { stdio: "pipe" });
  } catch (error) {
    console.error("❌ VS Code Insiders not found in PATH");
    console.error(
      "Please install VS Code Insiders or ensure it's in your PATH"
    );
    process.exit(1);
  }

  // Install the extension
  console.log("🚀 Installing extension in VS Code Insiders...");
  execSync(
    "code-insiders --install-extension synthwave-dark-dev.vsix --force",
    { stdio: "inherit" }
  );

  console.log("✅ Development installation complete!");
  console.log("");
  console.log("Next steps:");
  console.log("1. Open VS Code Insiders");
  console.log('2. Go to Extensions and enable "SynthWave Dark"');
  console.log("3. Apply the theme: Preferences > Color Theme > SynthWave Dark");
  console.log(
    '4. Run "Synthwave Dark: Enable Neon Dreams" command for glow effects'
  );
  console.log("");
  console.log('💡 Use "npm run dev-install" for future development installs');
} catch (error) {
  console.error("❌ Installation failed:", error.message);
  process.exit(1);
}
