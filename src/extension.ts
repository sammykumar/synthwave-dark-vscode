// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as semver from "semver";
import * as path from "path";
import * as fs from "fs";

type LiquidGlassEffect = "frosted" | "translucent";
type LiquidGlassSurface =
  | "primarySidebar"
  | "secondarySidebar"
  | "editor"
  | "bottomPanel";

interface LiquidGlassSurfaceConfig {
  enabled: boolean;
  transparency: number;
}

interface LiquidGlassConfig {
  effect: LiquidGlassEffect;
  surfaces: Record<LiquidGlassSurface, LiquidGlassSurfaceConfig>;
}

interface WorkbenchFeatures {
  enableGlow: boolean;
  liquidGlass: LiquidGlassConfig;
}

const LIQUID_GLASS_SURFACES: LiquidGlassSurface[] = [
  "primarySidebar",
  "secondarySidebar",
  "editor",
  "bottomPanel",
];

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let isUpdatingGlowConfiguration = false;
  console.log("Run Synthwave Dark: Enable Glow to enable glow effect");

  const enableGlowDisposable = vscode.commands.registerCommand(
    "synthwave-dark.enableGlow",
    async () => {
      if (!applyWorkbenchFeatures({ enableGlow: true })) {
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
      if (!applyWorkbenchFeatures({ enableGlow: false })) {
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
      if (applyWorkbenchFeatures({ enableGlow: false, liquidGlass: false })) {
        isUpdatingGlowConfiguration = true;
        await updateGlowConfiguration(false);
        await updateLiquidGlassConfiguration(false);
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
      if (
        e.affectsConfiguration("synthwaveDark.enableGlow") ||
        e.affectsConfiguration("synthwaveDark.liquidGlass")
      ) {
        if (isUpdatingGlowConfiguration) {
          return;
        }

        const features = getWorkbenchFeatures();
        if (applyWorkbenchFeatures(features)) {
          void promptForReload(
            "Synthwave Dark workbench effects changed. Reload to apply?",
          );
        }
      }
    }),
  );

  // Initial theme setup
  updateTheme();
  applyWorkbenchFeatures();
}

function applyWorkbenchFeatures(
  overrides: {
    enableGlow?: boolean;
    liquidGlass?: LiquidGlassConfig | false;
  } = {},
): boolean {
  const workbenchHtmlPath = getWorkbenchFilepath();

  if (!workbenchHtmlPath) {
    return false;
  }

  const currentFeatures = getWorkbenchFeatures();
  const features: WorkbenchFeatures = {
    enableGlow: overrides.enableGlow ?? currentFeatures.enableGlow,
    liquidGlass:
      overrides.liquidGlass === false
        ? disableLiquidGlass(currentFeatures.liquidGlass)
        : (overrides.liquidGlass ?? currentFeatures.liquidGlass),
  };

  return hasWorkbenchEffects(features)
    ? injectCSSAndJS(workbenchHtmlPath, features)
    : cleanUpWorkbench(workbenchHtmlPath);
}

function getWorkbenchFeatures(): WorkbenchFeatures {
  const configuration = vscode.workspace.getConfiguration();
  return {
    enableGlow: configuration.get<boolean>("synthwaveDark.enableGlow", false),
    liquidGlass: getLiquidGlassConfig(configuration),
  };
}

function getLiquidGlassConfig(
  configuration: vscode.WorkspaceConfiguration,
): LiquidGlassConfig {
  const effect = configuration.get<LiquidGlassEffect>(
    "synthwaveDark.liquidGlass.effect",
    "frosted",
  );

  return {
    effect: effect === "translucent" ? "translucent" : "frosted",
    surfaces: Object.fromEntries(
      LIQUID_GLASS_SURFACES.map((surface) => [
        surface,
        {
          enabled: configuration.get<boolean>(
            `synthwaveDark.liquidGlass.${surface}.enabled`,
            false,
          ),
          transparency: clampTransparency(
            configuration.get<number>(
              `synthwaveDark.liquidGlass.${surface}.transparency`,
              defaultTransparency(surface),
            ),
          ),
        },
      ]),
    ) as Record<LiquidGlassSurface, LiquidGlassSurfaceConfig>,
  };
}

function disableLiquidGlass(config: LiquidGlassConfig): LiquidGlassConfig {
  return {
    ...config,
    surfaces: Object.fromEntries(
      LIQUID_GLASS_SURFACES.map((surface) => [
        surface,
        { ...config.surfaces[surface], enabled: false },
      ]),
    ) as Record<LiquidGlassSurface, LiquidGlassSurfaceConfig>,
  };
}

function defaultTransparency(surface: LiquidGlassSurface): number {
  return surface === "editor" ? 0.1 : surface === "bottomPanel" ? 0.16 : 0.18;
}

export function clampTransparency(transparency: number): number {
  return Math.min(
    1,
    Math.max(0, Number.isFinite(transparency) ? transparency : 0),
  );
}

function hasWorkbenchEffects(features: WorkbenchFeatures): boolean {
  return (
    features.enableGlow ||
    LIQUID_GLASS_SURFACES.some(
      (surface) => features.liquidGlass.surfaces[surface].enabled,
    )
  );
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
export function deactivate() { }

async function updateGlowConfiguration(enableGlow: boolean): Promise<void> {
  await vscode.workspace
    .getConfiguration()
    .update("synthwaveDark.enableGlow", enableGlow, true);
}

async function updateLiquidGlassConfiguration(
  enableLiquidGlass: boolean,
): Promise<void> {
  const configuration = vscode.workspace.getConfiguration();
  await Promise.all(
    LIQUID_GLASS_SURFACES.map((surface) =>
      configuration.update(
        `synthwaveDark.liquidGlass.${surface}.enabled`,
        enableLiquidGlass,
        true,
      ),
    ),
  );
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

export function injectCSSAndJS(
  htmlFilepath: string,
  features: WorkbenchFeatures,
): boolean {
  try {
    cleanUpWorkbench(htmlFilepath);

    let html = fs.readFileSync(htmlFilepath, "utf-8");

    const packageJsonPath = path.join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const version = packageJson.version;

    const glowContent = features.enableGlow
      ? fs.readFileSync(path.join(__dirname, "css/global.css"), "utf-8")
      : "";
    const liquidGlassContent = generateLiquidGlassCss(features.liquidGlass);
    const jsContent = features.enableGlow
      ? `<script src="${path.join(__dirname, "js/glow.js")}"></script>`
      : "";
    const injectionBlock = `
<!-- START: Synthwave Dark ${version} (CSS + JS) -->
<style>
${glowContent}
${liquidGlassContent}
</style>
${jsContent}
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

export function generateLiquidGlassCss(config: LiquidGlassConfig): string {
  const blur =
    config.effect === "frosted"
      ? "backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%);"
      : "";

  const selectors: Record<LiquidGlassSurface, string> = {
    primarySidebar: ".monaco-workbench .part.sidebar",
    secondarySidebar: ".monaco-workbench .part.auxiliarybar",
    editor: ".monaco-workbench .part.editor",
    bottomPanel: ".monaco-workbench .part.panel",
  };

  return LIQUID_GLASS_SURFACES.flatMap((surface) => {
    const surfaceConfig = config.surfaces[surface];
    if (!surfaceConfig.enabled) {
      return [];
    }

    const transparency = clampTransparency(surfaceConfig.transparency);
    const opacity = (1 - transparency).toFixed(3);
    return `
/* Liquid Glass: ${surface} */
${selectors[surface]},
${selectors[surface]} > .content {
  background-color: rgba(10, 10, 10, ${opacity}) !important;
  border-color: rgba(255, 255, 255, 0.16) !important;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.08);
  ${blur}
}`;
  }).join("\n");
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
