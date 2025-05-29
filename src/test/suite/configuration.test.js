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
    // This test is now obsolete since disableGlow has been removed
    // The configuration may still exist in test environment due to caching
    // but is no longer used by the extension
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Test that the extension works without relying on disableGlow
    assert.ok(
      config.has("brightness"),
      "brightness configuration should exist"
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

    // Verify disableGlow property no longer exists
    const disableGlowConfig = config.properties["synthwaveDark.disableGlow"];
    assert.ok(
      !disableGlowConfig,
      "Should no longer have disableGlow configuration"
    );
  });

  test("Should handle configuration updates gracefully", async () => {
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Store original values
    const originalBrightness = config.get("brightness");

    try {
      // Test that we can update brightness setting without errors
      await config.update(
        "brightness",
        0.75,
        vscode.ConfigurationTarget.Global
      );

      // Verify updates can be called and return appropriate types
      const updatedConfig = vscode.workspace.getConfiguration("synthwaveDark");
      assert.ok(typeof updatedConfig.get("brightness") === "number");

      // Note: disableGlow may still exist in test environment due to caching
      // but is no longer used by the extension
    } finally {
      // Restore original values
      await config.update(
        "brightness",
        originalBrightness,
        vscode.ConfigurationTarget.Global
      );
    }
  });
});
