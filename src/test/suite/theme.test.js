const assert = require("assert");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

suite("Theme Test Suite", () => {
  test("Theme JSON file should exist and be valid", () => {
    const themePath = path.join(
      __dirname,
      "../../../themes/synthwave-color-theme.json"
    );
    assert.ok(fs.existsSync(themePath), "Theme file should exist");

    const themeContent = fs.readFileSync(themePath, "utf8");
    let themeData;

    assert.doesNotThrow(() => {
      themeData = JSON.parse(themeContent);
    }, "Theme JSON should be valid");

    // Verify theme structure
    assert.ok(themeData.name, "Theme should have a name");
    assert.ok(themeData.colors, "Theme should have colors");
    assert.ok(themeData.tokenColors, "Theme should have tokenColors");
  });

  test("CSS files should exist", () => {
    const cssPath = path.join(__dirname, "../../../src/css/editor_chrome.css");
    assert.ok(fs.existsSync(cssPath), "CSS file should exist");

    const cssContent = fs.readFileSync(cssPath, "utf8");
    assert.ok(cssContent.length > 0, "CSS file should not be empty");
    assert.ok(
      cssContent.includes(".monaco-editor"),
      "CSS should contain VS Code specific styles"
    );
  });

  test("JS template should exist and contain required placeholders", () => {
    const jsPath = path.join(__dirname, "../../../src/js/theme_template.js");
    assert.ok(fs.existsSync(jsPath), "JS template should exist");

    const jsContent = fs.readFileSync(jsPath, "utf8");
    assert.ok(
      jsContent.includes("[DISABLE_GLOW]"),
      "Template should contain DISABLE_GLOW placeholder"
    );
    assert.ok(
      jsContent.includes("[CHROME_STYLES]"),
      "Template should contain CHROME_STYLES placeholder"
    );
    assert.ok(
      jsContent.includes("[NEON_BRIGHTNESS]"),
      "Template should contain NEON_BRIGHTNESS placeholder"
    );
  });

  test("Should have theme contribution in package.json", () => {
    const packagePath = path.join(__dirname, "../../../package.json");
    const packageContent = JSON.parse(fs.readFileSync(packagePath, "utf8"));

    assert.ok(packageContent.contributes, "Package should have contributes");
    assert.ok(
      packageContent.contributes.themes,
      "Package should contribute themes"
    );
    assert.ok(
      Array.isArray(packageContent.contributes.themes),
      "Themes should be an array"
    );
    assert.strictEqual(
      packageContent.contributes.themes.length,
      1,
      "Should have exactly one theme"
    );

    const theme = packageContent.contributes.themes[0];
    assert.strictEqual(theme.label, "SynthWave Dark");
    assert.strictEqual(theme.uiTheme, "vs-dark");
    assert.strictEqual(theme.path, "./themes/synthwave-color-theme.json");
  });
});
