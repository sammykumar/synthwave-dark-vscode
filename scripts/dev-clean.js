#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🧹 SynthWave Dark - Clean Development Environment");
console.log("================================================");

try {
  // Remove all VSIX files
  console.log("🗑️  Removing VSIX packages...");
  const vsixFiles = fs
    .readdirSync(".")
    .filter((file) => file.endsWith(".vsix"));
  if (vsixFiles.length === 0) {
    console.log("   ℹ️  No VSIX files found");
  } else {
    vsixFiles.forEach((file) => {
      fs.unlinkSync(file);
      console.log(`   ✓ Removed ${file}`);
    });
  }

  // Remove all test data directories
  console.log("🗑️  Removing test data directories...");
  const testDirs = fs
    .readdirSync(".")
    .filter(
      (dir) => dir.startsWith(".vscode-test") && fs.statSync(dir).isDirectory()
    );
  if (testDirs.length === 0) {
    console.log("   ℹ️  No test directories found");
  } else {
    testDirs.forEach((dir) => {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`   ✓ Removed ${dir}`);
    });
  }

  // Remove any temporary user data directories in scripts folder
  const scriptsDir = __dirname;
  if (fs.existsSync(scriptsDir)) {
    const scriptTestDirs = fs.readdirSync(scriptsDir).filter((dir) => {
      const fullPath = path.join(scriptsDir, dir);
      return (
        dir.startsWith(".vscode-test") &&
        fs.existsSync(fullPath) &&
        fs.statSync(fullPath).isDirectory()
      );
    });
    scriptTestDirs.forEach((dir) => {
      const fullPath = path.join(scriptsDir, dir);
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`   ✓ Removed ${fullPath}`);
    });
  }

  // Remove any node_modules/.vscode-test directories
  console.log("🗑️  Removing cached VS Code downloads...");
  try {
    execSync(
      "find . -name '.vscode-test*' -type d -exec rm -rf {} + 2>/dev/null || true",
      { stdio: "pipe" }
    );
    console.log("   ✓ Removed cached downloads");
  } catch (error) {
    // Ignore errors - some directories might be in use
  }

  console.log("✅ Development environment cleaned!");
  console.log("");
  console.log("💡 You can now run:");
  console.log("   • npm run dev:start  - Fresh development instance");
  console.log("   • npm run dev:test   - Fresh test environment");
} catch (error) {
  console.error("❌ Cleanup failed:", error.message);
  console.error("You may need to manually remove test files");
  process.exit(1);
}
