import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// Fix: Change from ../../extension to ../extension
import * as synthwaveDarkExtension from "../../extension";

suite("Core Functionality Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be installed", () => {
    // Check if the extension is available in the extensions list
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode"
    );
    assert.ok(extension !== undefined, "Extension should be installed");
  });

  test("Extension should activate without errors", async () => {
    const context = {
      subscriptions: [],
      workspaceState: {
        get: () => undefined,
        update: () => Promise.resolve(),
      },
      globalState: {
        get: () => undefined,
        update: () => Promise.resolve(),
      },
    } as any;

    assert.doesNotThrow(() => {
      synthwaveDarkExtension.activate(context);
    });
  });

  test("Commands should be registered", async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes("synthwave-dark.enableGlow"));
    assert.ok(commands.includes("synthwave-dark.cleanup"));
  });

  test("Deactivate should not throw errors", () => {
    assert.doesNotThrow(() => {
      synthwaveDarkExtension.deactivate();
    });
  });
});
