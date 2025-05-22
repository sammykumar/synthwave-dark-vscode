/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("[Synthwave Dark] Extension activated");
  vscode.window.showInformationMessage("Synthwave Dark activated!");
  this.cntx = context;

  const config = vscode.workspace.getConfiguration("synthwaveDark");

  let disableGlow = config && config.disableGlow ? !!config.disableGlow : false;

  let brightness =
    parseFloat(config.brightness) > 1 ? 1 : parseFloat(config.brightness);
  brightness = brightness < 0 ? 0 : brightness;
  brightness = isNaN(brightness) ? 0.45 : brightness;

  const parsedBrightness = Math.floor(brightness * 255)
    .toString(16)
    .toUpperCase();
  let neonBrightness = parsedBrightness;

  let disposable = vscode.commands.registerCommand(
    "synthwaveDark.enableNeon",
    function () {
      const appDir = path.dirname(vscode.env.appRoot);
      const base = path.join(appDir, "app", "out", "vs", "code");
      const electronBase = isVSCodeBelowVersion("1.70.0")
        ? "electron-browser"
        : "electron-sandbox";
      const workBenchFilename =
        vscode.version == "1.94.0" ? "workbench.esm.html" : "workbench.html";

      const htmlFile = path.join(
        base,
        electronBase,
        "workbench",
        workBenchFilename
      );
      const templateFile = path.join(
        base,
        electronBase,
        "workbench",
        "neondreams.js"
      );

      try {
        // const version = context.globalState.get(`${context.extensionName}.version`);

        // generate production theme JS

        console.log("Reading Styles from css/editor_chrome.css");

        // Read styles from css/editor_chrome.css
        const chromeStyles = fs.readFileSync(
          __dirname + "/css/editor_chrome.css",
          "utf-8"
        );
        // Read template from js/theme_template.js
        const jsTemplate = fs.readFileSync(
          __dirname + "/js/theme_template.js",
          "utf-8"
        );

        console.log("Starting JS template file replacements");

        // Starting with the js template, process the file replacements and then send output to next stpe for replacements
        const themeWithGlow = jsTemplate.replace(
          /\[DISABLE_GLOW\]/g,
          disableGlow
        );
        const themeWithChrome = themeWithGlow.replace(
          /\[CHROME_STYLES\]/g,
          chromeStyles
        );
        const finalTheme = themeWithChrome.replace(
          /\[NEON_BRIGHTNESS\]/g,
          neonBrightness
        );

        console.log("Creating final theme");

        // Create the final theme
        fs.writeFileSync(templateFile, finalTheme, "utf-8");

        // modify workbench html
        const html = fs.readFileSync(htmlFile, "utf-8");

        // check if the tag is already there
        const isEnabled = html.includes("neondreams.js");

        if (!isEnabled) {
          // delete synthwave script tag if there
          let output = html.replace(
            /^.*(<!-- SYNTHWAVE 84 --><script src="neondreams.js"><\/script><!-- NEON DREAMS -->).*\n?/gm,
            ""
          );
          // add script tag
          output = html.replace(
            /\<\/html\>/g,
            `	<!-- SYNTHWAVE 84 --><script src="neondreams.js"></script><!-- NEON DREAMS -->\n`
          );
          output += "</html>";

          fs.writeFileSync(htmlFile, output, "utf-8");

          vscode.window
            .showInformationMessage(
              "Neon Dreams enabled. VS code must reload for this change to take effect. Code may display a warning that it is corrupted, this is normal. You can dismiss this message by choosing 'Don't show this again' on the notification.",
              { title: "Restart editor to complete" }
            )
            .then(function (msg) {
              vscode.commands.executeCommand("workbench.action.reloadWindow");
            });
        } else {
          vscode.window
            .showInformationMessage(
              "Neon dreams is already enabled. Reload to refresh JS settings.",
              { title: "Restart editor to refresh settings" }
            )
            .then(function (msg) {
              vscode.commands.executeCommand("workbench.action.reloadWindow");
            });
        }
      } catch (e) {
        if (/ENOENT|EACCES|EPERM/.test(e.code)) {
          console.log(e);
          vscode.window.showInformationMessage(
            "Neon Dreams was unable to modify the core VS code files needed to launch the extension. You may need to run VS code with admin privileges in order to enable Neon Dreams."
          );
          return;
        } else {
          vscode.window.showErrorMessage(
            "Something went wrong when starting neon dreams"
          );
          return;
        }
      }
    }
  );

  // Only keep the disable command
  let disable = vscode.commands.registerCommand(
    "synthwaveDark.disableNeon",
    uninstall
  );

  context.subscriptions.push(disable);
}

// New function to apply neon effect (extracted from the original enable command)
function applyNeonEffect(disableGlow, neonBrightness) {
  console.log("Applying Neon Effect");
  const isWin = /^win/.test(process.platform);

  var appDir;
  try {
    appDir = path.dirname(require.main.filename);
  } catch {
    appDir = _VSCODE_FILE_ROOT;
  }

  console.log("appDir:", appDir);
}

function uninstall() {
  var appDir = path.dirname(vscode.env.appRoot);
  var base = path.join(appDir, "app", "out", "vs", "code");
  var electronBase = isVSCodeBelowVersion("1.70.0")
    ? "electron-browser"
    : "electron-sandbox";
  var workBenchFilename =
    vscode.version == "1.94.0" ? "workbench.esm.html" : "workbench.html";

  var htmlFile = path.join(base, electronBase, "workbench", workBenchFilename);

  // Read styles from css/editor_chrome.css
  const chromeStyles = fs.readFileSync(
    __dirname + "/css/editor_chrome.css",
    "utf-8"
  );
  // Read template from js/theme_template.js
  const jsTemplate = fs.readFileSync(
    __dirname + "/js/theme_template.js",
    "utf-8"
  );

  console.log("Starting JS template file replacements");

  // Starting with the js template, process the file replacements and then send output to next stpe for replacements
  const themeWithGlow = jsTemplate.replace(/\[DISABLE_GLOW\]/g, disableGlow);
  const themeWithChrome = themeWithGlow.replace(
    /\[CHROME_STYLES\]/g,
    chromeStyles
  );
  const finalTheme = themeWithChrome.replace(
    /\[NEON_BRIGHTNESS\]/g,
    neonBrightness
  );

  console.log("Creating final theme");

  // Create the final theme
  fs.writeFileSync(templateFile, finalTheme, "utf-8");

  // modify workbench html
  const html = fs.readFileSync(htmlFile, "utf-8");
}

// Returns true if the VS Code version running this extension is below the
// version specified in the "version" parameter. Otherwise returns false.
function isVSCodeBelowVersion(version) {
  const vscodeVersion = vscode.version;
  const vscodeVersionArray = vscodeVersion.split(".").map(Number);
  const versionArray = version.split(".").map(Number);

  const len = Math.max(vscodeVersionArray.length, versionArray.length);

  for (let i = 0; i < len; i++) {
    const vscodePart = vscodeVersionArray[i] ?? 0;
    const versionPart = versionArray[i] ?? 0;

    if (vscodePart < versionPart) {
      return true;
    }
    if (vscodePart > versionPart) {
      return false;
    }
  }

  return false;
}
