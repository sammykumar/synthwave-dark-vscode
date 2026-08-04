import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// Fix: Change from ../../extension to ../extension
import { cleanUpWorkbench, findWorkbenchFilepath } from "../../extension";

suite("Core Functionality Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be installed", () => {
    // Check if the extension is available in the extensions list
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode",
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
      require("../../extension").activate(context);
    });
  });

  test("Commands should be registered", async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes("synthwave-dark.enableGlow"));
    assert.ok(commands.includes("synthwave-dark.disableGlow"));
    assert.ok(commands.includes("synthwave-dark.cleanup"));
  });

  test("Deactivate should not throw errors", () => {
    assert.doesNotThrow(() => {
      require("../../extension").deactivate();
    });
  });

  test("Finds the current electron-browser workbench layout", () => {
    const appRoot = fs.mkdtempSync(path.join(os.tmpdir(), "synthwave-app-"));
    const workbenchFilepath = path.join(
      appRoot,
      "out",
      "vs",
      "code",
      "electron-browser",
      "workbench",
      "workbench.html",
    );
    fs.mkdirSync(path.dirname(workbenchFilepath), { recursive: true });
    fs.writeFileSync(workbenchFilepath, "<head></head>");

    assert.strictEqual(findWorkbenchFilepath(appRoot), workbenchFilepath);

    fs.rmSync(appRoot, { recursive: true, force: true });
  });

  test("Falls back to the electron-sandbox workbench layout", () => {
    const appRoot = fs.mkdtempSync(path.join(os.tmpdir(), "synthwave-app-"));
    const workbenchFilepath = path.join(
      appRoot,
      "out",
      "vs",
      "code",
      "electron-sandbox",
      "workbench",
      "workbench.html",
    );
    fs.mkdirSync(path.dirname(workbenchFilepath), { recursive: true });
    fs.writeFileSync(workbenchFilepath, "<head></head>");

    assert.strictEqual(findWorkbenchFilepath(appRoot), workbenchFilepath);

    fs.rmSync(appRoot, { recursive: true, force: true });
  });

  test("Returns undefined when no writable workbench file exists", () => {
    const appRoot = fs.mkdtempSync(path.join(os.tmpdir(), "synthwave-app-"));

    assert.strictEqual(findWorkbenchFilepath(appRoot), undefined);

    fs.rmSync(appRoot, { recursive: true, force: true });
  });

  test("Removes the glow injection block from a workbench file", () => {
    const workbenchFilepath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), "synthwave-workbench-")),
      "workbench.html",
    );
    fs.writeFileSync(
      workbenchFilepath,
      "<head><!-- START: Synthwave Dark 1.5.2 (CSS + JS) --><style>test</style><!-- FINISH: Synthwave Dark 1.5.2 (CSS + JS) --></head>",
    );

    assert.strictEqual(cleanUpWorkbench(workbenchFilepath), true);
    assert.strictEqual(
      fs.readFileSync(workbenchFilepath, "utf-8"),
      "<head></head>",
    );

    fs.rmSync(path.dirname(workbenchFilepath), {
      recursive: true,
      force: true,
    });
  });
});
