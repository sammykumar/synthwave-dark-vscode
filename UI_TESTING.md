# UI Testing Guide

## Overview

The UI tests for SynthWave Dark extension validate that the glow effects functionality works correctly by testing the injection of CSS and JavaScript into VS Code's workbench.html file.

## Test Structure

### Core Tests vs UI Tests

The test configuration has been split into two categories:

1. **Core Tests** (`src/test/core/`): Run with extensions disabled, test basic functionality
2. **UI Tests** (`src/test/ui/`): Run with extension loaded, test actual glow effects injection

### UI Test Functionality

The UI tests validate:

1. **Injection Pattern**: Tests that the extension correctly injects glow effects into workbench.html
2. **Marker Validation**: Checks for the specific comment marker: `<!-- START: Synthwave Dark ${version} (CSS + JS) -->`
3. **Cleanup Functionality**: Verifies that glow effects can be properly removed
4. **Version Compatibility**: Tests VS Code version checking for glow support

## Running Tests

### Prerequisites

- Node.js and npm installed
- VS Code installed (for full integration tests)
- Internet access (for downloading VS Code test instance)

### Running All Tests

```bash
npm test
```

### Running Specific Test Categories

```bash
# Run only core tests (extensions disabled)
npx vscode-test --label coreTests

# Run only UI tests (extension loaded)
npx vscode-test --label uiTests
```

### Manual Validation

For environments without internet access, you can run the injection logic validation:

```bash
node /tmp/test-ui-validation.js
```

## Test Configuration

The test configuration is defined in `.vscode-test.mjs`:

- **Core Tests**: Run with `--disable-extensions` for isolated testing
- **UI Tests**: Run with extension loaded via `extensionDevelopmentPath`

## Glow Effects Testing Details

### What Gets Tested

1. **HTML Injection**: The extension modifies VS Code's workbench.html file
2. **Comment Markers**: Specific markers are inserted to identify injected content
3. **CSS/JS Content**: Style and script tags are properly injected
4. **Cleanup**: Injection can be removed cleanly

### Expected Injection Pattern

When glow effects are enabled, the extension injects:

```html
<!-- START: Synthwave Dark 1.5.2 (CSS + JS) -->
<style>
/* Glow effect CSS */
</style>
<script src="glow.js">
</script>
<!-- FINISH: Synthwave Dark 1.5.2 (CSS + JS) -->
```

### Restart Requirement

The issue mentions that VS Code needs to be restarted for glow effects to take full effect. This is because:

1. The extension modifies the workbench.html file on disk
2. VS Code needs to reload this file to apply the changes
3. The extension shows a "Reload now" dialog after injection

In the test environment, we validate the injection step without requiring a full restart, as the key requirement is ensuring the marker is present in the workbench.html file.

## Troubleshooting

### Common Issues

1. **Network Errors**: The test runner needs internet access to download VS Code
2. **Permission Errors**: Tests need write access to create temporary files
3. **Extension Not Found**: UI tests require the extension to be properly loaded

### Local Development

For local development and testing:

1. Build the extension: `npm run compile`
2. Compile tests: `npm run compile-tests`
3. Run tests: `npm test`

### CI/CD Environment

In CI environments, tests run in headless mode and may need additional setup for graphics-less environments.