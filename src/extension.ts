// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as semver from "semver";
import * as path from "path";
import * as fs from "fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let isUpdatingGlowConfiguration = false;
  console.log("Run Synthwave Dark: Enable Glow to enable glow effect");

  const enableGlowDisposable = vscode.commands.registerCommand(
    "synthwave-dark.enableGlow",
    async () => {
      if (!applyGlowEffects(true)) {
        return;
      }

      isUpdatingGlowConfiguration = true;
      await updateGlowConfiguration(true);
      isUpdatingGlowConfiguration = false;
      await promptForReload("Glow effects enabled. Reload to apply?");
    },
  );

  const disableGlowDisposable = vscode.commands.registerCommand(
    "synthwave-dark.disableGlow",
    async () => {
      if (!applyGlowEffects(false)) {
        return;
      }

      isUpdatingGlowConfiguration = true;
      await updateGlowConfiguration(false);
      isUpdatingGlowConfiguration = false;
      await promptForReload("Glow effects disabled. Reload to apply?");
    },
  );

  const cleanUpWorkbenchDisposable = vscode.commands.registerCommand(
    "synthwave-dark.cleanup",
    async () => {
      if (applyGlowEffects(false)) {
        isUpdatingGlowConfiguration = true;
        await updateGlowConfiguration(false);
        isUpdatingGlowConfiguration = false;
        await promptForReload("Glow modifications removed. Reload to apply?");
      }
    },
  );

  context.subscriptions.push(enableGlowDisposable);
  context.subscriptions.push(disableGlowDisposable);
  context.subscriptions.push(cleanUpWorkbenchDisposable);

  // Update theme when configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("synthwaveDark.enableGlow")) {
        if (isUpdatingGlowConfiguration) {
          return;
        }

        const enableGlow = vscode.workspace
          .getConfiguration()
          .get<boolean>("synthwaveDark.enableGlow", false);
        if (applyGlowEffects(enableGlow)) {
          void promptForReload(
            enableGlow
              ? "Glow effects enabled. Reload to apply?"
              : "Glow effects disabled. Reload to apply?",
          );
        }
      }
    }),
  );

  // Initial theme setup
  updateTheme();
}

function applyGlowEffects(enableGlow: boolean): boolean {
  const workbenchHtmlPath = getWorkbenchFilepath();

  if (!workbenchHtmlPath) {
    return false;
  }

  return enableGlow
    ? injectCSSAndJS(workbenchHtmlPath)
    : cleanUpWorkbench(workbenchHtmlPath);
}

export function findWorkbenchFilepath(appRoot: string): string | undefined {
  const workbenchDirectory = path.join(appRoot, "out", "vs", "code");
  const candidates = [
    path.join(
      workbenchDirectory,
      "electron-browser",
      "workbench",
      "workbench.html",
    ),
    path.join(
      workbenchDirectory,
      "electron-sandbox",
      "workbench",
      "workbench.html",
    ),
    path.join(
      workbenchDirectory,
      "electron-browser",
      "workbench",
      "workbench.esm.html",
    ),
    path.join(
      workbenchDirectory,
      "electron-sandbox",
      "workbench",
      "workbench.esm.html",
    ),
  ];

  return candidates.find((candidate) => {
    try {
      fs.accessSync(candidate, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch {
      return false;
    }
  });
}

function getWorkbenchFilepath(): string | undefined {
  const workbenchFilepath = findWorkbenchFilepath(vscode.env.appRoot);

  if (!workbenchFilepath) {
    void vscode.window.showErrorMessage(
      "Synthwave Dark could not access a writable VS Code workbench file. Reinstall VS Code or grant write access to its application files.",
    );
  }

  return workbenchFilepath;
}

function updateTheme() {
  const config = vscode.workspace.getConfiguration();
  const enableGlow = config.get<boolean>("synthwaveDark.enableGlow", false);
  const MIN_VERSION = "1.12.0";
  const hasGlowSupport = semver.gte(vscode.version, MIN_VERSION);

  if (enableGlow && !hasGlowSupport) {
    vscode.window.showWarningMessage(
      `SynthWave Dark: Neon glow effects require VS Code ${MIN_VERSION} or newer. Disabling glow effects.`,
    );
    config.update("synthwaveDark.enableGlow", false, true);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function updateGlowConfiguration(enableGlow: boolean): Promise<void> {
  await vscode.workspace
    .getConfiguration()
    .update("synthwaveDark.enableGlow", enableGlow, true);
}

async function promptForReload(message: string): Promise<void> {
  const choice = await vscode.window.showInformationMessage(
    message,
    "Reload now",
    "Later",
  );

  if (choice === "Reload now") {
    await vscode.commands.executeCommand("workbench.action.reloadWindow");
  }
}

export function injectCSSAndJS(htmlFilepath: string): boolean {
  try {
    cleanUpWorkbench(htmlFilepath);

    let html = fs.readFileSync(htmlFilepath, "utf-8");

    const packageJsonPath = path.join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const version = packageJson.version;

    const cssPath = path.join(__dirname, "css/global.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    const jsPath = path.join(__dirname, "js/glow.js");
    const injectionBlock = `
<!-- START: Synthwave Dark ${version} (CSS + JS) -->
<style>
${cssContent}
</style>
<script src="${jsPath}">
</script>
<!-- FINISH: Synthwave Dark ${version} (CSS + JS) -->
`;

    if (html.includes("</head>")) {
      html = html.replace("</head>", `${injectionBlock}</head>`);
    } else {
      html += injectionBlock;
    }

    fs.writeFileSync(htmlFilepath, html, "utf-8");
    return true;
  } catch (error) {
    console.error("Synthwave Dark failed to enable glow effects.", error);
    void vscode.window.showErrorMessage(
      "Synthwave Dark could not modify the VS Code workbench file.",
    );
    return false;
  }
}

export function cleanUpWorkbench(workbenchHtmlFilepath: string): boolean {
  try {
    const html = fs.readFileSync(workbenchHtmlFilepath, "utf-8");
    const cleanedHtml = html.replace(
      /<!-- START: Synthwave Dark[\s\S]*?<!-- FINISH: Synthwave Dark.*?-->\s*/g,
      "",
    );

    fs.writeFileSync(workbenchHtmlFilepath, cleanedHtml, "utf-8");
    return true;
  } catch (error) {
    console.error("Synthwave Dark failed to remove glow effects.", error);
    void vscode.window.showErrorMessage(
      "Synthwave Dark could not modify the VS Code workbench file.",
    );
    return false;
  }
}
