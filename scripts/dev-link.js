#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("🔗 SynthWave Dark - Development Symlink");
console.log("=======================================");

try {
  // Get VS Code Insiders extensions directory
  const extensionsDir = path.join(
    os.homedir(),
    ".vscode-insiders",
    "extensions"
  );
  const extensionName = "sammykumar.synthwave-dark-vscode";
  const extensionDir = path.join(extensionsDir, extensionName);
  const currentDir = process.cwd();

  console.log("📂 Extensions directory:", extensionsDir);
  console.log("🎯 Extension target:", extensionDir);
  console.log("📍 Current directory:", currentDir);

  // Ensure extensions directory exists
  if (!fs.existsSync(extensionsDir)) {
    console.log("📁 Creating extensions directory...");
    fs.mkdirSync(extensionsDir, { recursive: true });
  }

  // Remove existing installation (packaged or symlinked)
  if (fs.existsSync(extensionDir)) {
    console.log("🗑️  Removing existing installation...");
    if (fs.lstatSync(extensionDir).isSymbolicLink()) {
      fs.unlinkSync(extensionDir);
    } else {
      fs.rmSync(extensionDir, { recursive: true, force: true });
    }
  }

  // Create symlink to current directory
  console.log("🔗 Creating development symlink...");
  fs.symlinkSync(currentDir, extensionDir);

  console.log("✅ Development symlink created!");
  console.log("");
  console.log("Next steps:");
  console.log("1. Restart VS Code Insiders");
  console.log(
    "2. The extension will automatically reload when you save changes"
  );
  console.log(
    '3. Use "Developer: Reload Window" command to refresh after changes'
  );
  console.log("");
  console.log('💡 Use "npm run dev-unlink" to remove the symlink');
  console.log(
    '💡 Use "npm run dev-install" to go back to packaged installation'
  );
} catch (error) {
  console.error("❌ Symlink creation failed:", error.message);
  console.error("");
  console.error("Common issues:");
  console.error("- VS Code Insiders not installed");
  console.error("- Insufficient permissions");
  console.error("- Extension already running (close VS Code Insiders first)");
  process.exit(1);
}
