const assert = require("assert");
const vscode = require("vscode");
const path = require("path");

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be present", () => {
    assert.ok(
      vscode.extensions.getExtension("SammyKumar.synthwave-dark-vscode")
    );
  });

  test("Extension should activate", async () => {
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode"
    );
    await extension.activate();
    assert.ok(extension.isActive);
  });

  test("Should register disable neon command", async () => {
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode"
    );
    await extension.activate();

    const commands = await vscode.commands.getCommands(true);
    assert.ok(commands.includes("synthwaveDark.disableNeon"));
  });

  test("Should have configuration properties", () => {
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Test that configuration properties exist
    assert.ok(config.has("brightness"));
    assert.ok(config.has("disableGlow"));

    // Test default values
    assert.strictEqual(config.get("brightness"), 1);
    assert.strictEqual(config.get("disableGlow"), false);
  });

  test("Should handle configuration changes", async () => {
    const config = vscode.workspace.getConfiguration("synthwaveDark");

    // Update configuration
    await config.update(
      "brightness",
      0.5,
      vscode.ConfigurationTarget.Workspace
    );
    await config.update(
      "disableGlow",
      true,
      vscode.ConfigurationTarget.Workspace
    );

    // Verify changes
    assert.strictEqual(config.get("brightness"), 0.5);
    assert.strictEqual(config.get("disableGlow"), true);

    // Reset to defaults
    await config.update("brightness", 1, vscode.ConfigurationTarget.Workspace);
    await config.update(
      "disableGlow",
      false,
      vscode.ConfigurationTarget.Workspace
    );
  });
});
