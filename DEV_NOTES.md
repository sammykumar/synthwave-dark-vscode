# SynthWave Dark VS Code Extension - Developer Notes

## How the Extension Works

This VS Code extension creates a synthwave/neon glow effect by modifying VS Code's core HTML and CSS files. Here's how it works:

### Core Mechanism

1. **File Modification**: The extension modifies VS Code's `workbench.html` file to inject custom JavaScript
2. **CSS Injection**: Custom CSS styles are injected to create the glow effects
3. **Dynamic Loading**: The glow effect is applied dynamically when the extension is enabled

### Key Files

- `src/extension.js` - Main extension logic
- `src/css/editor_chrome.css` - CSS styles for the glow effects
- `src/js/theme_template.js` - JavaScript template that gets injected into VS Code
- `themes/synthwave-color-theme.json` - Color theme definition

### Extension Flow

1. **Activation**: Extension activates on VS Code startup
2. **Command Registration**: Registers enable/disable commands
3. **File Paths**: Determines VS Code installation paths based on version
4. **Template Processing**: Replaces placeholders in the JavaScript template:
   - `[DISABLE_GLOW]` - Whether to disable glow effects
   - `[CHROME_STYLES]` - CSS styles from editor_chrome.css
   - `[NEON_BRIGHTNESS]` - Brightness value (0-255 hex)
5. **HTML Modification**: Injects script tag into workbench.html
6. **Reload Required**: VS Code must reload for changes to take effect

### Configuration Options

The extension supports these settings:

```json
{
  "synthwaveDark.brightness": 1.0 // Glow brightness (0.0-1.0)
}
```

### VS Code Version Compatibility

The extension handles different VS Code versions:

- Pre-1.70.0: Uses `electron-browser` folder
- 1.70.0+: Uses `electron-sandbox` folder
- 1.94.0: Uses `workbench.esm.html` instead of `workbench.html`

## Development Setup

### Prerequisites

- Node.js
- VS Code
- Git

### Installation

```bash
npm install
```

### Testing

Run the test suite:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

### Test Structure

- `src/test/runTest.js` - Test runner configuration
- `src/test/suite/` - Test suites:
  - `extension.test.js` - Core extension functionality
  - `configuration.test.js` - Configuration handling
  - `integration.test.js` - Integration tests
  - `commands.test.js` - Command testing
  - `theme.test.js` - Theme validation

### Building and Packaging

Create a new version and package:

```bash
npm run package-and-install
```

This will:

1. Increment patch version
2. Package the extension
3. Install it in VS Code Insiders

Individual commands:

```bash
npm run version:patch    # Increment version
npm run package         # Create .vsix package
npm run install-extension # Install in VS Code
```

## Architecture Notes

### Why File Modification?

VS Code doesn't provide APIs to modify the editor's visual appearance at the DOM level. The only way to achieve glow effects is by:

1. Injecting custom CSS/JS into VS Code's core files
2. Using the CSS `text-shadow` and `box-shadow` properties for glow effects
3. Modifying the HTML structure to add the necessary elements

### Security Implications

- The extension requires write access to VS Code's installation directory
- May trigger VS Code's "corrupted installation" warning (normal behavior)
- Users may need admin privileges depending on VS Code installation location

### Maintenance Considerations

- VS Code updates may overwrite modifications
- Different VS Code versions have different file structures
- Extension needs to handle version compatibility
- Users need to re-enable after VS Code updates

## Debugging

### Common Issues

1. **Permission Errors**: Run VS Code as administrator
2. **File Not Found**: Check VS Code version compatibility
3. **Effect Not Visible**: Ensure VS Code reloaded after enabling
4. **Corrupted Warning**: Normal behavior, can be dismissed

### Debugging Steps

1. Check console logs in extension host
2. Verify file paths exist for your VS Code version
3. Check if HTML modification was successful
4. Verify CSS injection is working

### File Locations

VS Code files are typically located at:

- **macOS**: `/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/`
- **Windows**: `C:\Users\{username}\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\code\`
- **Linux**: `/usr/share/code/resources/app/out/vs/code/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## User Settings Integration

The extension integrates with the `vscode_vibrancy` extension for additional visual effects:

```json
{
  "vscode_vibrancy.imports": [
    "/path/to/synthwave-dark-vscode/src/css/editor_chrome.css"
  ],
  "vscode_vibrancy.opacity": 0.4,
  "workbench.colorTheme": "SynthWave Dark"
}
```

This creates a combined effect with transparency and glow.
