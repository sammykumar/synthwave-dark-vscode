const assert = require("assert");
const vscode = require("vscode");

suite("Configuration Test Suite", () => {
  test("Should validate brightness configuration range", async () => {
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Test valid values
    await config.update(
      "brightness",
      0.5,
      vscode.ConfigurationTarget.Workspace
    );
    assert.strictEqual(config.get("brightness"), 0.5);

    await config.update("brightness", 0, vscode.ConfigurationTarget.Workspace);
    assert.strictEqual(config.get("brightness"), 0);

    await config.update("brightness", 1, vscode.ConfigurationTarget.Workspace);
    assert.strictEqual(config.get("brightness"), 1);

    // Reset to default
    await config.update(
      "brightness",
      undefined,
      vscode.ConfigurationTarget.Workspace
    );
  });

  test("Should handle boolean disableGlow configuration", async () => {
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Test boolean values
    await config.update(
      "disableGlow",
      true,
      vscode.ConfigurationTarget.Workspace
    );
    assert.strictEqual(config.get("disableGlow"), true);

    await config.update(
      "disableGlow",
      false,
      vscode.ConfigurationTarget.Workspace
    );
    assert.strictEqual(config.get("disableGlow"), false);

    // Reset to default
    await config.update(
      "disableGlow",
      undefined,
      vscode.ConfigurationTarget.Workspace
    );
  });

  test("Configuration should have proper schema in package.json", () => {
    const packagePath = require("path").join(
      __dirname,
      "../../../package.json"
    );
    const packageContent = JSON.parse(
      require("fs").readFileSync(packagePath, "utf8")
    );

    assert.ok(
      packageContent.contributes.configuration,
      "Package should have configuration"
    );

    const config = packageContent.contributes.configuration;
    assert.strictEqual(config.title, "Synthwave Dark");
    assert.ok(config.properties, "Configuration should have properties");

    // Check brightness property
    const brightnessConfig = config.properties["synthwaveDark.brightness"];
    assert.ok(brightnessConfig, "Should have brightness configuration");
    assert.strictEqual(brightnessConfig.type, "number");
    assert.strictEqual(brightnessConfig.default, 1);

    // Check disableGlow property
    const disableGlowConfig = config.properties["synthwaveDark.disableGlow"];
    assert.ok(disableGlowConfig, "Should have disableGlow configuration");
    assert.strictEqual(disableGlowConfig.type, "boolean");
    assert.strictEqual(disableGlowConfig.default, false);
  });

  test("Should handle configuration updates gracefully", async () => {
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Store original values
    const originalBrightness = config.get("brightness");
    const originalDisableGlow = config.get("disableGlow");

    try {
      // Update multiple settings
      await Promise.all([
        config.update("brightness", 0.75, vscode.ConfigurationTarget.Workspace),
        config.update(
          "disableGlow",
          true,
          vscode.ConfigurationTarget.Workspace
        ),
      ]);

      // Verify updates
      assert.strictEqual(config.get("brightness"), 0.75);
      assert.strictEqual(config.get("disableGlow"), true);
    } finally {
      // Restore original values
      await Promise.all([
        config.update(
          "brightness",
          originalBrightness,
          vscode.ConfigurationTarget.Workspace
        ),
        config.update(
          "disableGlow",
          originalDisableGlow,
          vscode.ConfigurationTarget.Workspace
        ),
      ]);
    }
  });
});
