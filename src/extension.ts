// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as semver from 'semver';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Check if the current VS Code version supports textShadow (>=1.12.0)
	const MIN_VERSION = '1.12.0';
	const hasGlowSupport = semver.gte(vscode.version, MIN_VERSION);



	// Show confirmation message to user

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Run Synthwave Dark: Enable Glow to enable glow effect');

	// Register the test command defined in package.json
	const enableGlowDisposable = vscode.commands.registerCommand('synthwave-dark.enableGlow', async () => {
		// Retrieve and log file paths
		const workbenchHtmlPath = getWorkbenchFilepath();

		injectCSSAndJS(workbenchHtmlPath);
		vscode.window.setStatusBarMessage('Reloading in 1 seconds…', 1000);

		vscode.commands.executeCommand('workbench.action.reloadWindow');


	});

	const cleanUpWorkbenchDisposable = vscode.commands.registerCommand('synthwave-dark.cleanup', () => {
		// Retrieve and log file paths
		const workbenchHtmlPath = getWorkbenchFilepath();

		cleanUpWorkbench(workbenchHtmlPath);
	});

	context.subscriptions.push(enableGlowDisposable);
	context.subscriptions.push(cleanUpWorkbenchDisposable);

	// Update theme when configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('synthwaveDark.enableGlow')) {
				updateTheme();
			}
		})
	);

	// Initial theme setup
	updateTheme();
}

function getWorkbenchFilepath() {
	console.group("getWorkbenchFilepath()");
	const appDir = path.dirname(vscode.env.appRoot);
	const base = path.join(appDir, 'app', 'out', 'vs', 'code');
	const electronBase = isVSCodeBelowVersion("1.70.0") ? "electron-browser" : "electron-sandbox";
	const workBenchFilename = vscode.version === "1.94.0" ? "workbench.esm.html" : "workbench.html";
	const fullWorkbenchFilepath = path.join(base, electronBase, "workbench", workBenchFilename);

	console.log("App Dir", appDir);
	console.log("Base", base);
	console.log("electronBase", electronBase);
	console.log("workBenchFilename", workBenchFilename);
	console.log("fullWorkbenchFilepath", fullWorkbenchFilepath);

	vscode.window.showInformationMessage('File paths retrieved! Check console output.');

	console.groupEnd();

	return fullWorkbenchFilepath;

}

function updateTheme() {
	const config = vscode.workspace.getConfiguration();
	const enableGlow = config.get<boolean>('synthwaveDark.enableGlow', false);
	const MIN_VERSION = '1.12.0';
	const hasGlowSupport = semver.gte(vscode.version, MIN_VERSION);

	if (enableGlow && !hasGlowSupport) {
		vscode.window.showWarningMessage(
			`SynthWave Dark: Neon glow effects require VS Code ${MIN_VERSION} or newer. Disabling glow effects.`
		);
		config.update('synthwaveDark.enableGlow', false, true);
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }

// TODO: Move to utils
// Returns true if the VS Code version running this extension is below the
// version specified in the "version" parameter. Otherwise returns false.
function isVSCodeBelowVersion(version: String) {
	const vscodeVersion = vscode.version;
	const vscodeVersionArray = vscodeVersion.split('.').map(Number);
	const versionArray = version.split('.').map(Number);

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

function injectCSSAndJS(htmlFilepath: string) {

	// Clean up previous injections
	cleanUpWorkbench(htmlFilepath);

	console.group("injectCSSAndJS()");

	// Read HTML file content
	let html = fs.readFileSync(htmlFilepath, 'utf-8');

	// Get version from package.json
	const packageJsonPath = path.join(__dirname, '..', 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	const version = packageJson.version;

	// Read global CSS content
	const cssPath = path.join(__dirname, 'css/global.css');
	const cssContent = fs.readFileSync(cssPath, 'utf-8');

	console.log("cssPath", cssPath);

	// Read global JS Path
	const jsPath = path.join(__dirname, 'js/glow.js');


	console.log("jsPath", jsPath);


	// Create injection block with comments and CSS
	const injectionBlock = `
<!-- START: Synthwave Dark ${version} (CSS + JS) -->
<style>
${cssContent}
</style>
<script src="${jsPath}">
</script>
<!-- FINISH: Synthwave Dark ${version} (CSS + JS) -->
`;

	// Inject CSS before closing </head> tag
	if (html.includes('</head>')) {
		html = html.replace('</head>', `${injectionBlock}</head>`);
	} else {
		// Fallback: append to end of file
		html += injectionBlock;
	}

	// Write modified HTML back to file
	fs.writeFileSync(htmlFilepath, html, 'utf-8');
	vscode.window.showInformationMessage(`Injected Global CSS into ${htmlFilepath}.`);

	console.groupEnd();

}

function cleanUpWorkbench(workbenchHtmlFilepath: string) {
	console.group("cleanUpWorkbench()");

	// Read HTML file content
	let html = fs.readFileSync(workbenchHtmlFilepath, 'utf-8');

	// Remove injected CSS block
	const cleanedHtml = html.replace(/<!-- START: Synthwave Dark[\s\S]*?<!-- FINISH: Synthwave Dark.*?-->\s*/g, '');

	// Write cleaned HTML back to file
	fs.writeFileSync(workbenchHtmlFilepath, cleanedHtml, 'utf-8');
	vscode.window.showInformationMessage(`Removed injected CSS from ${workbenchHtmlFilepath}`);

	console.groupEnd();
}
