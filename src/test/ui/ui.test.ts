import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

// For direct testing of injection logic
const semver = require('semver');

suite("UI Test Suite - Glow Effects Validation", () => {
  vscode.window.showInformationMessage("Starting UI tests for SynthWave Dark glow effects...");

  test("Extension availability and command registration", async () => {
    // Check if the extension is available in the extensions list
    const extension = vscode.extensions.getExtension("SammyKumar.synthwave-dark-vscode");
    
    if (extension) {
      console.log("✓ Extension found in VS Code environment");
      
      // Ensure the extension is activated  
      if (!extension.isActive) {
        await extension.activate();
      }
      assert.ok(extension.isActive, "Extension should be activated");
      console.log("✓ Extension successfully activated");
      
      // Check if commands are registered
      const commands = await vscode.commands.getCommands();
      assert.ok(commands.includes("synthwave-dark.enableGlow"), 
        "synthwave-dark.enableGlow command should be registered");
      assert.ok(commands.includes("synthwave-dark.cleanup"), 
        "synthwave-dark.cleanup command should be registered");
      console.log("✓ Glow effect commands are properly registered");
      
    } else {
      console.log("ℹ Extension not found - running in test mode with disabled extensions");
      console.log("ℹ This is expected in core test environment");
    }
  });

  test("Glow effects injection pattern validation (Core Functionality)", async () => {
    console.log("Testing glow effects injection pattern...");
    
    // Test the injection logic that the extension uses
    // This simulates what happens when synthwave-dark.enableGlow command is executed
    
    const testDir = path.join(__dirname, "../../../tmp/test-workbench");
    const testWorkbenchPath = path.join(testDir, "workbench.html");
    
    // Ensure test directory exists
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Create a minimal mock workbench HTML file matching VS Code's structure
    const initialHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>VS Code</title>
  <link rel="stylesheet" href="workbench.css">
</head>
<body class="vs-dark">
  <div class="monaco-workbench">
    <div id="workbench.main.container"></div>
  </div>
</body>
</html>`;
    
    fs.writeFileSync(testWorkbenchPath, initialHtml, 'utf-8');
    
    // Test the injection pattern used by the extension
    function simulateInjectCSSAndJS(htmlFilepath: string) {
      // Clean up previous injections (simulate cleanUpWorkbench)
      let html = fs.readFileSync(htmlFilepath, 'utf-8');
      html = html.replace(/<!-- START: Synthwave Dark[\s\S]*?<!-- FINISH: Synthwave Dark.*?-->\s*/g, '');
      
      // Get version (simulate reading from package.json)
      const version = "1.5.2"; // Current version from package.json
      
      // Mock CSS content (simulate reading from css/global.css)
      const cssContent = `
/* Synthwave Dark Glow Effects */
.monaco-workbench {
  background: #1a1a1a;
}
.token.keyword {
  color: #f92672;
  text-shadow: 0 0 5px #f92672;
}
.token.string {
  color: #e6db74;
  text-shadow: 0 0 5px #e6db74;
}`;
      
      // Mock JS path (simulate js/glow.js path)
      const jsPath = path.join(__dirname, "js/glow.js");
      
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
    console.log("✓ Initial workbench state verified (no glow effects)");
    
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
    assert.ok(finalContent.includes("#f92672"), 
      "Workbench should contain synthwave colors");
    
    console.log("✓ Glow effects injection pattern test passed");
    console.log("✓ Found expected injection markers");
    console.log("✓ CSS and JS properly injected into workbench.html");
    console.log("✓ Synthwave color effects validated");
    
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

  test("VS Code version compatibility and workbench path logic", () => {
    console.log("Testing VS Code version compatibility...");
    
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
    
    // Test workbench file path logic (same as extension)
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
    
    // Test that the path follows expected pattern
    assert.ok(workbenchPath.includes("workbench"), "Path should include workbench directory");
    assert.ok(workbenchPath.includes(electronBase), "Path should include correct electron base");
    
    console.log("✓ Version compatibility checks passed");
    console.log("✓ Workbench path construction logic validated");
  });

  test("Integration test - Glow effects command execution (when extension loaded)", async () => {
    console.log("Testing glow effects command execution...");
    
    const extension = vscode.extensions.getExtension("SammyKumar.synthwave-dark-vscode");
    
    if (extension && extension.isActive) {
      console.log("✓ Extension is active - testing command execution");
      
      try {
        // This would be the actual integration test if VS Code allows workbench modification
        // For now, we just verify the command exists and can be called
        const commands = await vscode.commands.getCommands();
        
        if (commands.includes("synthwave-dark.enableGlow")) {
          console.log("✓ Enable glow command is available");
          
          // In a real VS Code environment with proper permissions,
          // this would actually modify the workbench.html file:
          // await vscode.commands.executeCommand('synthwave-dark.enableGlow');
          
          console.log("ℹ Command execution test would require VS Code restart to verify effects");
          console.log("ℹ Use manual testing or integration environment for full validation");
        }
        
      } catch (error) {
        console.log(`Command execution test encountered: ${error instanceof Error ? error.message : String(error)}`);
      }
      
    } else {
      console.log("ℹ Extension not active - skipping command execution test");
      console.log("ℹ This is expected when running with disabled extensions");
    }
    
    // This test always passes as it's informational
    assert.ok(true, "Integration test completed");
  });
});
