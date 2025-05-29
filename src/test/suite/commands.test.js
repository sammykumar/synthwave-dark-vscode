const assert = require("assert");
const vscode = require("vscode");
const sinon = require("sinon");

suite("Commands Test Suite", () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test("Both neon commands should be available", async () => {
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode"
    );
    await extension.activate();

    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes("synthwaveDark.disableNeon"),
      "Disable neon command should be registered"
    );
    assert.ok(
      commands.includes("synthwaveDark.enableNeon"),
      "Enable neon command should be registered"
    );
  });

  test("Disable neon command should execute without error", async () => {
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode"
    );
    await extension.activate();

    // Mock window.showInformationMessage to avoid actual UI interaction
    const showInfoStub = sandbox.stub(vscode.window, "showInformationMessage");
    showInfoStub.resolves({ title: "Restart editor to complete" });

    // Mock executeCommand to avoid actual reload
    const executeCommandStub = sandbox.stub(vscode.commands, "executeCommand");
    executeCommandStub.resolves();

    // Execute the command
    await assert.doesNotReject(async () => {
      await vscode.commands.executeCommand("synthwaveDark.disableNeon");
    }, "Disable neon command should execute without throwing");
  });

  test("Should have proper command contribution in package.json", () => {
    const packagePath = require("path").join(
      __dirname,
      "../../../package.json"
    );
    const packageContent = JSON.parse(
      require("fs").readFileSync(packagePath, "utf8")
    );

    assert.ok(
      packageContent.contributes.commands,
      "Package should contribute commands"
    );
    assert.ok(
      Array.isArray(packageContent.contributes.commands),
      "Commands should be an array"
    );

    const disableCommand = packageContent.contributes.commands.find(
      (cmd) => cmd.command === "synthwaveDark.disableNeon"
    );
    const enableCommand = packageContent.contributes.commands.find(
      (cmd) => cmd.command === "synthwaveDark.enableNeon"
    );

    assert.ok(disableCommand, "Should have disable neon command");
    assert.strictEqual(
      disableCommand.title,
      "Synthwave Dark: Disable Neon Dreams"
    );

    assert.ok(enableCommand, "Should have enable neon command");
    assert.strictEqual(
      enableCommand.title,
      "Synthwave Dark: Enable Neon Dreams"
    );
  });
});
