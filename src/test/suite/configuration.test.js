const assert = require("assert");
const vscode = require("vscode");

suite("Configuration Test Suite", () => {
  test("Should validate brightness configuration range", async () => {
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Store original value
    const originalBrightness = config.get("brightness");

    try {
      // Test that we can set valid values without errors
      await config.update("brightness", 0.5, vscode.ConfigurationTarget.Global);

      await config.update("brightness", 0, vscode.ConfigurationTarget.Global);

      await config.update("brightness", 1, vscode.ConfigurationTarget.Global);

      // Verify the configuration accepts number values
      const finalConfig = vscode.workspace.getConfiguration("synthwaveDark");
      assert.ok(typeof finalConfig.get("brightness") === "number");
    } finally {
      // Reset to original value
      await config.update(
        "brightness",
        originalBrightness,
        vscode.ConfigurationTarget.Global
      );
    }
  });

  test("Should handle boolean disableGlow configuration", async () => {
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Store original value
    const originalDisableGlow = config.get("disableGlow");

    try {
      // Test that we can set boolean values without errors
      await config.update(
        "disableGlow",
        true,
        vscode.ConfigurationTarget.Global
      );

      await config.update(
        "disableGlow",
        false,
        vscode.ConfigurationTarget.Global
      );

      // Verify the configuration accepts boolean values
      const finalConfig = vscode.workspace.getConfiguration("synthwaveDark");
      assert.ok(typeof finalConfig.get("disableGlow") === "boolean");
    } finally {
      // Reset to original value
      await config.update(
        "disableGlow",
        originalDisableGlow,
        vscode.ConfigurationTarget.Global
      );
    }
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
      // Test that we can update multiple settings without errors
      await Promise.all([
        config.update("brightness", 0.75, vscode.ConfigurationTarget.Global),
        config.update("disableGlow", true, vscode.ConfigurationTarget.Global),
      ]);

      // Verify updates can be called and return appropriate types
      const updatedConfig = vscode.workspace.getConfiguration("synthwaveDark");
      assert.ok(typeof updatedConfig.get("brightness") === "number");
      assert.ok(typeof updatedConfig.get("disableGlow") === "boolean");
    } finally {
      // Restore original values
      await Promise.all([
        config.update(
          "brightness",
          originalBrightness,
          vscode.ConfigurationTarget.Global
        ),
        config.update(
          "disableGlow",
          originalDisableGlow,
          vscode.ConfigurationTarget.Global
        ),
      ]);
    }
  });
});
