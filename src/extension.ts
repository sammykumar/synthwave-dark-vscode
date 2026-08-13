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
const NATIVE_VIBRANCY_START = "/* SYNTHWAVE-DARK-LIQUID-GLASS-START */";
const NATIVE_VIBRANCY_END = "/* SYNTHWAVE-DARK-LIQUID-GLASS-END */";
const NATIVE_WINDOW_OPTIONS =
  'frame:false,transparent:true,visualEffectState:"active",experimentalDarkMode';

const NATIVE_VIBRANCY_RUNTIME = `
${NATIVE_VIBRANCY_START}
;(() => {
  if (process.platform !== "darwin") {
    return;
  }

  void import("electron").then(({ app, BrowserWindow }) => {
    const applyVibrancy = (window) => {
      const applyToWorkbench = () => {
        const url = window.webContents.getURL();
        if (!/workbench(?:\\.esm)?\\.html/.test(url)) {
          return;
        }

        window.setBackgroundColor("#00000000");
        window.setVibrancy("under-window");
      };

      window.webContents.once("dom-ready", applyToWorkbench);
    };

    app.on("browser-window-created", (_event, window) => applyVibrancy(window));
    BrowserWindow.getAllWindows().forEach(applyVibrancy);
  });
})();
${NATIVE_VIBRANCY_END}
`;

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
        await promptForRestart(
          "Glow and Liquid Glass modifications removed. Restart VS Code to apply.",
        );
      }
    },
  );

  context.subscriptions.push(enableGlowDisposable);
  context.subscriptions.push(disableGlowDisposable);
  context.subscriptions.push(cleanUpWorkbenchDisposable);

  // Update theme when configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      const liquidGlassChanged = e.affectsConfiguration(
        "synthwaveDark.liquidGlass",
      );
      if (e.affectsConfiguration("synthwaveDark.enableGlow") || liquidGlassChanged) {
        if (isUpdatingGlowConfiguration) {
          return;
        }

        const features = getWorkbenchFeatures();
        if (applyWorkbenchFeatures(features)) {
          if (liquidGlassChanged && process.platform === "darwin") {
            void promptForRestart(
              "Liquid Glass changed. Restart VS Code to apply the native macOS material.",
            );
          } else {
            void promptForReload(
              "Synthwave Dark workbench effects changed. Reload to apply?",
            );
          }
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

  if (!applyNativeVibrancy(features)) {
    return false;
  }

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

function hasLiquidGlass(features: WorkbenchFeatures): boolean {
  return LIQUID_GLASS_SURFACES.some(
    (surface) => features.liquidGlass.surfaces[surface].enabled,
  );
}

function applyNativeVibrancy(features: WorkbenchFeatures): boolean {
  if (process.platform !== "darwin") {
    return true;
  }

  const electronMainFilepath = path.join(vscode.env.appRoot, "out", "main.js");
  const updateNativeVibrancy = hasLiquidGlass(features)
    ? enableNativeVibrancy
    : disableNativeVibrancy;

  if (updateNativeVibrancy(electronMainFilepath)) {
    return true;
  }

  void vscode.window.showErrorMessage(
    "Synthwave Dark could not update the VS Code native vibrancy settings.",
  );
  return false;
}

export function enableNativeVibrancy(electronMainFilepath: string): boolean {
  try {
    const source = fs.readFileSync(electronMainFilepath, "utf-8");
    const cleanedSource = removeNativeVibrancy(source);

    if (!cleanedSource.includes("experimentalDarkMode")) {
      return false;
    }

    const patchedSource = cleanedSource.replace(
      "experimentalDarkMode",
      NATIVE_WINDOW_OPTIONS,
    );
    fs.writeFileSync(
      electronMainFilepath,
      `${patchedSource}${NATIVE_VIBRANCY_RUNTIME}`,
      "utf-8",
    );
    return true;
  } catch (error) {
    console.error("Synthwave Dark failed to enable native vibrancy.", error);
    return false;
  }
}

export function disableNativeVibrancy(electronMainFilepath: string): boolean {
  try {
    const source = fs.readFileSync(electronMainFilepath, "utf-8");
    fs.writeFileSync(electronMainFilepath, removeNativeVibrancy(source), "utf-8");
    return true;
  } catch (error) {
    console.error("Synthwave Dark failed to disable native vibrancy.", error);
    return false;
  }
}

function removeNativeVibrancy(source: string): string {
  const runtimePattern = new RegExp(
    `\\n?${escapeRegExp(NATIVE_VIBRANCY_START)}[\\s\\S]*?${escapeRegExp(NATIVE_VIBRANCY_END)}\\n?`,
    "g",
  );

  return source
    .replace(runtimePattern, "")
    .replace(NATIVE_WINDOW_OPTIONS, "experimentalDarkMode");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

async function promptForRestart(message: string): Promise<void> {
  await vscode.window.showInformationMessage(message);
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
    const liquidGlassRuntimeScript = generateLiquidGlassRuntimeScript(
      features.liquidGlass,
    );
    const jsContent = [
      features.enableGlow
        ? `<script src="${path.join(__dirname, "js/glow.js")}"></script>`
        : "",
      liquidGlassRuntimeScript
        ? `<script>${liquidGlassRuntimeScript}</script>`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
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

  const surfaces: Record<
    LiquidGlassSurface,
    { container: string; transparentLayers: string[] }
  > = {
    primarySidebar: {
      container: ".monaco-workbench .part.sidebar",
      transparentLayers: [
        ".monaco-workbench .part.sidebar > .content",
        ".monaco-workbench .part.sidebar .composite",
        ".monaco-workbench .part.sidebar .pane",
        ".monaco-workbench .part.sidebar .pane-header",
        ".monaco-workbench .part.sidebar .monaco-list",
        ".monaco-workbench .part.sidebar .monaco-list-rows",
        ".monaco-workbench .part.sidebar .monaco-tree-sticky-container",
      ],
    },
    secondarySidebar: {
      container: ".monaco-workbench .part.auxiliarybar",
      transparentLayers: [
        ".monaco-workbench .part.auxiliarybar > .content",
        ".monaco-workbench .part.auxiliarybar .composite",
        ".monaco-workbench .part.auxiliarybar .pane",
        ".monaco-workbench .part.auxiliarybar .pane-header",
        ".monaco-workbench .part.auxiliarybar .monaco-list",
        ".monaco-workbench .part.auxiliarybar .monaco-list-rows",
        ".monaco-workbench .part.auxiliarybar .monaco-tree-sticky-container",
      ],
    },
    editor: {
      container: ".monaco-workbench .part.editor",
      transparentLayers: [
        ".monaco-workbench .part.editor > .content",
        ".monaco-workbench .part.editor .editor-group-container",
        ".monaco-workbench .part.editor .editor-container",
        ".monaco-workbench .part.editor .monaco-editor",
        ".monaco-workbench .part.editor .monaco-editor-background",
        ".monaco-workbench .part.editor .editor-group-container > .title",
        ".monaco-workbench .part.editor .tabs-container",
        ".monaco-workbench .part.editor .tabs-container .tab",
      ],
    },
    bottomPanel: {
      container: ".monaco-workbench .part.panel",
      transparentLayers: [
        ".monaco-workbench .part.panel > .content",
        ".monaco-workbench .part.panel .composite",
        ".monaco-workbench .part.panel .pane",
        ".monaco-workbench .part.panel .pane-header",
        ".monaco-workbench .part.panel .monaco-list",
        ".monaco-workbench .part.panel .monaco-list-rows",
        ".monaco-workbench .part.panel .xterm-viewport",
      ],
    },
  };

  return LIQUID_GLASS_SURFACES.flatMap((surface) => {
    const surfaceConfig = config.surfaces[surface];
    if (!surfaceConfig.enabled) {
      return [];
    }

    const transparency = clampTransparency(surfaceConfig.transparency);
    const opacity = (1 - transparency).toFixed(3);
    const { container, transparentLayers } = surfaces[surface];
    return `
/* Liquid Glass: ${surface} */
html,
body,
.monaco-workbench {
  background-color: transparent !important;
}
${container} {
  background-color: rgba(18, 19, 20, ${opacity}) !important;
  border-color: rgba(255, 255, 255, 0.16) !important;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.08);
  ${blur}
}
${transparentLayers.join(",\n")} {
  background-color: transparent !important;
}`;
  }).join("\n");
}

export function generateLiquidGlassRuntimeScript(
  config: LiquidGlassConfig,
): string {
  const containers: Record<LiquidGlassSurface, string> = {
    primarySidebar: ".monaco-workbench .part.sidebar",
    secondarySidebar: ".monaco-workbench .part.auxiliarybar",
    editor: ".monaco-workbench .part.editor",
    bottomPanel: ".monaco-workbench .part.panel",
  };

  const surfaces = LIQUID_GLASS_SURFACES.flatMap((surface) => {
    const surfaceConfig = config.surfaces[surface];
    if (!surfaceConfig.enabled) {
      return [];
    }

    return {
      container: containers[surface],
      backgroundColor: `rgba(18, 19, 20, ${(1 - clampTransparency(surfaceConfig.transparency)).toFixed(3)})`,
    };
  });

  if (surfaces.length === 0) {
    return "";
  }

  return `
(() => {
  const surfaces = ${JSON.stringify(surfaces)};
  let observer;
  const applySurfaceBackgrounds = () => {
    const allSurfacesFound = surfaces.every(({ container, backgroundColor }) => {
      const elements = document.querySelectorAll(container);
      elements.forEach((element) => {
        element.style.setProperty("background-color", backgroundColor, "important");
      });
      return elements.length > 0;
    });

    if (allSurfacesFound) {
      observer?.disconnect();
    }
  };

  observer = new MutationObserver(applySurfaceBackgrounds);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  applySurfaceBackgrounds();
})();
`;
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
