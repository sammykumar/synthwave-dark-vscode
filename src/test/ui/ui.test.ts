import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// Fix: Change from ../../extension to ../extension
import * as synthwaveDarkExtension from "../../extension";

suite("UI Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");
});
