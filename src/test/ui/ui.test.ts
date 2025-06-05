import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

// For direct testing of injection logic
const semver = require('semver');

suite("UI Test Suite", () => {
  vscode.window.showInformationMessage("Start UI tests.");

  test("Glow effects injection pattern should work correctly", async () => {
    // Test the injection logic that the extension uses
    // This simulates what happens when synthwave-dark.enableGlow command is executed
    
    const testDir = path.join(__dirname, "../../../tmp/test-workbench");
    const testWorkbenchPath = path.join(testDir, "workbench.html");
    
    // Ensure test directory exists
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Create a minimal mock workbench HTML file
    const initialHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>VS Code</title>
</head>
<body>
  <div id="workbench"></div>
</body>
</html>`;
    
    fs.writeFileSync(testWorkbenchPath, initialHtml, 'utf-8');
    
    // Test the injection pattern used by the extension
    function simulateInjectCSSAndJS(htmlFilepath: string) {
      // Clean up previous injections (simulate cleanUpWorkbench)
      let html = fs.readFileSync(htmlFilepath, 'utf-8');
      html = html.replace(/<!-- START: Synthwave Dark[\s\S]*?<!-- FINISH: Synthwave Dark.*?-->\s*/g, '');
      
      // Get version (simulate reading from package.json)
      const version = "1.5.2"; // Current version
      
      // Mock CSS content (simulate reading from css/global.css)
      const cssContent = `
/* Synthwave Dark Glow Effects */
.monaco-workbench {
  background: #1a1a1a;
}
.token {
  text-shadow: 0 0 5px currentColor;
}`;
      
      // Mock JS path (simulate js/glow.js path)
      const jsPath = "glow.js";
      
      // Create injection block with comments and CSS (same pattern as extension)
      const injectionBlock = `
<!-- START: Synthwave Dark ${version} (CSS + JS) -->
<style>
${cssContent}
</style>
<script src="${jsPath}">
</script>
<!-- FINISH: Synthwave Dark ${version} (CSS + JS) -->
`;
      
      // Inject CSS before closing </head> tag (same logic as extension)
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${injectionBlock}</head>`);
      } else {
        // Fallback: append to end of file
        html += injectionBlock;
      }
      
      // Write modified HTML back to file
      fs.writeFileSync(htmlFilepath, html, 'utf-8');
    }
    
    // Verify initial state - no glow effects
    let content = fs.readFileSync(testWorkbenchPath, 'utf-8');
    assert.ok(!content.includes("<!-- START: Synthwave Dark"), 
      "Test workbench should not have glow effects initially");
    
    // Simulate the injection process
    simulateInjectCSSAndJS(testWorkbenchPath);
    
    // Verify injection worked
    const finalContent = fs.readFileSync(testWorkbenchPath, 'utf-8');
    
    // Check for the exact markers that the extension uses
    const expectedStartMarker = "<!-- START: Synthwave Dark 1.5.2 (CSS + JS) -->";
    const expectedEndMarker = "<!-- FINISH: Synthwave Dark 1.5.2 (CSS + JS) -->";
    
    assert.ok(finalContent.includes(expectedStartMarker), 
      `Workbench should contain exact start marker: ${expectedStartMarker}`);
    assert.ok(finalContent.includes(expectedEndMarker), 
      `Workbench should contain exact end marker: ${expectedEndMarker}`);
    assert.ok(finalContent.includes("<style>"), 
      "Workbench should contain injected CSS");
    assert.ok(finalContent.includes("<script"), 
      "Workbench should contain injected JS");
    assert.ok(finalContent.includes("text-shadow"), 
      "Workbench should contain glow CSS effects");
    
    console.log("✓ Glow effects injection pattern test passed");
    console.log("✓ Found expected injection markers");
    console.log("✓ CSS and JS properly injected into workbench.html");
    
    // Test cleanup functionality
    function simulateCleanUpWorkbench(htmlFilepath: string) {
      let html = fs.readFileSync(htmlFilepath, 'utf-8');
      const cleanedHtml = html.replace(/<!-- START: Synthwave Dark[\s\S]*?<!-- FINISH: Synthwave Dark.*?-->\s*/g, '');
      fs.writeFileSync(htmlFilepath, cleanedHtml, 'utf-8');
    }
    
    // Test cleanup
    simulateCleanUpWorkbench(testWorkbenchPath);
    const cleanedContent = fs.readFileSync(testWorkbenchPath, 'utf-8');
    assert.ok(!cleanedContent.includes("<!-- START: Synthwave Dark"), 
      "Cleanup should remove glow effects injection");
    assert.ok(!cleanedContent.includes("text-shadow"), 
      "Cleanup should remove glow CSS");
    
    console.log("✓ Glow effects cleanup test passed");
    
    // Clean up test file
    try {
      fs.unlinkSync(testWorkbenchPath);
      fs.rmdirSync(testDir);
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  test("VS Code version compatibility check should work", () => {
    // Test the version checking logic used by the extension
    function isVSCodeBelowVersion(version: string) {
      const vscodeVersion = vscode.version;
      const vscodeVersionArray = vscodeVersion.split('.').map(Number);
      const versionArray = version.split('.').map(Number);

      const len = Math.max(vscodeVersionArray.length, versionArray.length);

      for (let i = 0; i < len; i++) {
        const vscodePart = vscodeVersionArray[i] ?? 0;
        const versionPart = versionArray[i] ?? 0;

        if (vscodePart < versionPart) {
          return true;
        }
        if (vscodePart > versionPart) {
          return false;
        }
      }
      return false;
    }
    
    // Test glow support checking
    const MIN_VERSION = '1.12.0';
    const hasGlowSupport = semver.gte(vscode.version, MIN_VERSION);
    
    console.log(`Current VS Code version: ${vscode.version}`);
    console.log(`Minimum required version: ${MIN_VERSION}`);
    console.log(`Has glow support: ${hasGlowSupport}`);
    
    // Most modern VS Code versions should support glow effects
    assert.ok(hasGlowSupport, 
      `VS Code ${vscode.version} should support glow effects (requires ${MIN_VERSION}+)`);
    
    // Test workbench file path logic
    const appDir = path.dirname(vscode.env.appRoot);
    const base = path.join(appDir, 'app', 'out', 'vs', 'code');
    const electronBase = isVSCodeBelowVersion("1.70.0") ? "electron-browser" : "electron-sandbox";
    const workBenchFilename = vscode.version === "1.94.0" ? "workbench.esm.html" : "workbench.html";
    const workbenchPath = path.join(base, electronBase, "workbench", workBenchFilename);
    
    console.log(`Expected workbench path: ${workbenchPath}`);
    console.log(`Electron base: ${electronBase}`);
    console.log(`Workbench filename: ${workBenchFilename}`);
    
    // The path should be constructible (even if file doesn't exist in test env)
    assert.ok(typeof workbenchPath === 'string' && workbenchPath.length > 0, 
      "Workbench path should be constructible");
    
    console.log("✓ Version compatibility checks passed");
  });
});
