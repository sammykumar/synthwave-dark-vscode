// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as semver from 'semver';

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
		vscode.window.showInformationMessage('Hello World from SynthWave Dark');
	});

	context.subscriptions.push(disposable);

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
export function deactivate() {}
