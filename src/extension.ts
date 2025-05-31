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




	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "synthwave-dark-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('synthwave-dark.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Synthwave Dark!');
	});

	// Register the test command defined in package.json
	const testDisposable = vscode.commands.registerCommand('synthwave-dark.test', () => {
		// Retrieve and log file paths
		const workbenchHtmlPath = getWorkbenchFilepath();
		// Show confirmation message to user
		vscode.window.showInformationMessage('File paths retrieved! Check console output.');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(testDisposable);

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

function injectCSS(htmlFilepath: string) {
	const html = fs.readFileSync(htmlFilepath);
}
