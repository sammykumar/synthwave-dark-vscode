import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// Fix: Change from ../../extension to ../extension
import {
  clampTransparency,
  cleanUpWorkbench,
  findWorkbenchFilepath,
  generateLiquidGlassCss,
} from "../../extension";

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
    const extension = vscode.extensions.getExtension(
      "SammyKumar.synthwave-dark-vscode",
    );

    assert.ok(extension !== undefined, "Extension should be installed");
    await assert.doesNotReject(async () => extension.activate());
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

  test("Applies Liquid Glass when its setting is enabled", async () => {
    const workbenchFilepath = findWorkbenchFilepath(vscode.env.appRoot);
    assert.ok(workbenchFilepath, "VS Code workbench file should be writable");

    const setting = "synthwaveDark.liquidGlass.primarySidebar.enabled";
    const configuration = vscode.workspace.getConfiguration();
    const configurationChanged = new Promise<void>((resolve) => {
      const disposable = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration(setting)) {
          disposable.dispose();
          resolve();
        }
      });
    });

    await configuration.update(setting, true, vscode.ConfigurationTarget.Global);
    await configurationChanged;

    try {
      const workbenchHtml = fs.readFileSync(workbenchFilepath, "utf-8");
      assert.ok(workbenchHtml.includes("Liquid Glass: primarySidebar"));
    } finally {
      await configuration.update(
        setting,
        false,
        vscode.ConfigurationTarget.Global,
      );
    }
  });

  test("Does not generate Liquid Glass CSS when all surfaces are disabled", () => {
    const css = generateLiquidGlassCss({
      effect: "frosted",
      surfaces: {
        primarySidebar: { enabled: false, transparency: 0.18 },
        secondarySidebar: { enabled: false, transparency: 0.18 },
        editor: { enabled: false, transparency: 0.1 },
        bottomPanel: { enabled: false, transparency: 0.16 },
      },
    });

    assert.strictEqual(css, "");
  });

  test("Generates frosted Liquid Glass CSS only for enabled surfaces", () => {
    const css = generateLiquidGlassCss({
      effect: "frosted",
      surfaces: {
        primarySidebar: { enabled: true, transparency: 0.2 },
        secondarySidebar: { enabled: false, transparency: 0.18 },
        editor: { enabled: false, transparency: 0.1 },
        bottomPanel: { enabled: false, transparency: 0.16 },
      },
    });

    assert.ok(css.includes("Liquid Glass: primarySidebar"));
    assert.ok(css.includes(".part.sidebar"));
    assert.ok(css.includes("rgba(10, 10, 10, 0.800)"));
    assert.ok(css.includes("backdrop-filter: blur(18px)"));
    assert.ok(!css.includes("Liquid Glass: editor"));
  });

  test("Omits blur in translucent Liquid Glass mode", () => {
    const css = generateLiquidGlassCss({
      effect: "translucent",
      surfaces: {
        primarySidebar: { enabled: false, transparency: 0.18 },
        secondarySidebar: { enabled: false, transparency: 0.18 },
        editor: { enabled: true, transparency: 0.4 },
        bottomPanel: { enabled: false, transparency: 0.16 },
      },
    });

    assert.ok(css.includes("Liquid Glass: editor"));
    assert.ok(css.includes("rgba(10, 10, 10, 0.600)"));
    assert.ok(!css.includes("backdrop-filter"));
  });

  test("Clamps Liquid Glass transparency to its supported range", () => {
    assert.strictEqual(clampTransparency(-0.5), 0);
    assert.strictEqual(clampTransparency(0.35), 0.35);
    assert.strictEqual(clampTransparency(1.5), 1);
    assert.strictEqual(clampTransparency(Number.NaN), 0);
  });
});
