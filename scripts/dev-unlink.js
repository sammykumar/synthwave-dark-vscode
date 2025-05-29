#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("🔌 SynthWave Dark - Remove Development Symlink");
console.log("==============================================");

try {
  // Get VS Code Insiders extensions directory
  const extensionsDir = path.join(
    os.homedir(),
    ".vscode-insiders",
    "extensions"
  );
  const extensionName = "sammykumar.synthwave-dark-vscode";
  const extensionDir = path.join(extensionsDir, extensionName);

  console.log("🎯 Extension target:", extensionDir);

  // Check if symlink exists
  if (fs.existsSync(extensionDir)) {
    if (fs.lstatSync(extensionDir).isSymbolicLink()) {
      console.log("🗑️  Removing development symlink...");
      fs.unlinkSync(extensionDir);
      console.log("✅ Development symlink removed!");
    } else {
      console.log("📦 Found packaged installation, removing...");
      fs.rmSync(extensionDir, { recursive: true, force: true });
      console.log("✅ Packaged installation removed!");
    }
  } else {
    console.log("ℹ️  No extension installation found");
  }

  console.log("");
  console.log("Next steps:");
  console.log("1. Restart VS Code Insiders");
  console.log('2. Use "npm run dev-link" for symlink development');
  console.log('3. Use "npm run dev-install" for packaged development');
} catch (error) {
  console.error("❌ Unlink failed:", error.message);
  process.exit(1);
}
