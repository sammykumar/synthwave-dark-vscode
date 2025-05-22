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

  // Apply neon effect by default
  applyNeonEffect(disableGlow, neonBrightness);

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

  const base = appDir + (isWin ? "\\vs\\code" : "/vs/code");
  const electronBase = isVSCodeBelowVersion("1.70.0")
    ? "electron-browser"
    : "electron-sandbox";

  const htmlFile = path.join(
    appDir,
    "vs/code/electron-sandbox/workbench/workbench.html"
  );

  console.log("htmlFile Path", htmlFile);

  const templateFile =
    base +
    (isWin
      ? "\\" + electronBase + "\\workbench\\neondreams.js"
      : "/" + electronBase + "/workbench/neondreams.js");

  try {
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
          "Neon Dreams enabled by default. VS code must reload for this change to take effect. Code may display a warning that it is corrupted, this is normal. You can dismiss this message by choosing 'Don't show this again' on the notification.",
          { title: "Restart editor to complete" }
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
