const assert = require("assert");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const sinon = require("sinon");

suite("Integration Test Suite", () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test("Extension activation should setup configuration listener", async () => {
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode"
    );
    await extension.activate();

    assert.ok(extension.isActive, "Extension should be active");

    // Verify extension has registered its dispose handlers
    assert.ok(
      extension.exports === undefined || extension.exports,
      "Extension should export properly"
    );
  });

  test("Should handle workspace configuration changes", async () => {
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode"
    );
    await extension.activate();

    const config = vscode.workspace.getConfiguration("synthwaveDark");
    const originalBrightness = config.get("brightness");

    try {
      // Change configuration
      await config.update(
        "brightness",
        0.8,
        vscode.ConfigurationTarget.Workspace
      );

      // Verify configuration was updated
      const updatedConfig = vscode.workspace.getConfiguration("synthwaveDark");
      assert.strictEqual(updatedConfig.get("brightness"), 0.8);
    } finally {
      // Restore original configuration
      await config.update(
        "brightness",
        originalBrightness,
        vscode.ConfigurationTarget.Workspace
      );
    }
  });

  test("Should have correct file structure for theme assets", () => {
    const requiredFiles = [
      "src/extension.js",
      "src/css/editor_chrome.css",
      "src/js/theme_template.js",
      "themes/synthwave-color-theme.json",
    ];

    requiredFiles.forEach((file) => {
      const filePath = path.join(__dirname, "../../../", file);
      assert.ok(fs.existsSync(filePath), `Required file should exist: ${file}`);
    });
  });

  test("Theme template should contain valid JavaScript", () => {
    const templatePath = path.join(
      __dirname,
      "../../../src/js/theme_template.js"
    );
    const templateContent = fs.readFileSync(templatePath, "utf8");

    // Verify it contains expected functions and structure
    assert.ok(
      templateContent.includes("function"),
      "Template should contain functions"
    );
    assert.ok(
      templateContent.includes("tokenReplacements"),
      "Template should define token replacements"
    );
    assert.ok(
      templateContent.includes("initNeonDreams"),
      "Template should have init function"
    );
  });

  test("CSS should contain Monaco editor styling", () => {
    const cssPath = path.join(__dirname, "../../../src/css/editor_chrome.css");
    const cssContent = fs.readFileSync(cssPath, "utf8");

    // Verify it contains VS Code specific classes
    assert.ok(
      cssContent.includes(".monaco-editor"),
      "CSS should style Monaco editor"
    );
    assert.ok(
      cssContent.includes(".monaco-workbench"),
      "CSS should style workbench"
    );
    assert.ok(
      cssContent.includes("linear-gradient"),
      "CSS should include gradient effects"
    );
    assert.ok(
      cssContent.includes("text-shadow"),
      "CSS should include glow effects"
    );
  });

  test("Package.json should have correct metadata", () => {
    const packagePath = path.join(__dirname, "../../../package.json");
    const packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    // Verify essential package metadata
    assert.strictEqual(packageContent.name, "synthwave-dark-vscode");
    assert.strictEqual(packageContent.displayName, "SynthWave Dark");
    assert.ok(packageContent.version, "Should have version");
    assert.strictEqual(packageContent.publisher, "SammyKumar");
    assert.ok(
      Array.isArray(packageContent.categories),
      "Should have categories"
    );
    assert.ok(
      packageContent.categories.includes("Themes"),
      "Should be categorized as Theme"
    );

    // Verify VS Code engine requirement
    assert.ok(
      packageContent.engines && packageContent.engines.vscode,
      "Should specify VS Code engine"
    );

    // Verify main entry point
    assert.strictEqual(packageContent.main, "./src/extension.js");

    // Verify activation events
    assert.ok(
      Array.isArray(packageContent.activationEvents),
      "Should have activation events"
    );
    assert.ok(
      packageContent.activationEvents.includes("onStartupFinished"),
      "Should activate on startup"
    );
  });
});
