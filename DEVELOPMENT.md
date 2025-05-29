# Development Workflow

This document explains the development workflow for the SynthWave Dark VS Code extension using isolated testing environments.

## Quick Start

### Fresh Development Instance (Recommended)

Creates a completely isolated VS Code instance with your extension pre-installed:

```bash
npm run dev:start
```

**Benefits:**

- ✅ Completely isolated from your main VS Code installation
- ✅ No cache conflicts or version issues
- ✅ Fresh environment for each testing session
- ✅ Extension pre-installed and ready to test
- ✅ No modification of your main VS Code setup

**Use this when:**

- Testing the extension in a clean environment
- Debugging installation or activation issues
- Ensuring no conflicts with other extensions
- Preparing for release testing

### Fresh Test Environment

Runs all extension tests in a completely fresh VS Code instance:

```bash
npm run dev:test
```

**Benefits:**

- ✅ Isolated test environment
- ✅ No interference from existing extensions
- ✅ Consistent test results
- ✅ Automatic cleanup after testing

## Available Commands

### Development Commands

- `npm run dev:start` - Launch fresh VS Code instance with extension
- `npm run dev:test` - Run tests in fresh VS Code environment
- `npm run dev:clean` - Clean all test data and cached downloads

### Packaging Commands

- `npm run clean` - Remove all VSIX files and test data
- `npm run package` - Create versioned package
- `npm run build` - Version bump and package

### Release Commands

- `npm run version:patch` - Increment patch version
- `npm run version:minor` - Increment minor version
- `npm run version:major` - Increment major version

### Testing Commands

- `npm run test` - Run extension tests (uses fresh instance)
- `npm run test:watch` - Run tests in watch mode

## Development Workflow

### 1. Initial Setup

```bash
# Clone and setup
git clone <repo>
cd synthwave-dark-vscode
npm install
```

### 2. Development Testing

```bash
# Launch fresh development instance
npm run dev:start
```

This will:

1. Clean any previous test data
2. Create a development package
3. Download a fresh VS Code instance
4. Install your extension in the fresh instance
5. Launch VS Code with your extension ready to test

### 3. Making Changes

1. Make your code changes
2. In the fresh VS Code instance, press `F5` to open Extension Development Host
3. Test your changes in the Extension Development Host
4. Or restart with `npm run dev:start` for a completely fresh test

### 4. Running Tests

```bash
# Run all tests in fresh environment
npm run dev:test
```

### 5. Cleanup

```bash
# Clean all test data when done
npm run dev:clean
```

### 6. Preparing for Release

```bash
# Test final package
npm run build

# Create release
npm run version:patch  # or minor/major
git push && git push --tags
```

## Troubleshooting

### Extension Not Loading

The fresh instance approach eliminates most loading issues since each test starts completely clean.

### Permission Errors

Fresh instances avoid permission issues since they don't modify your main VS Code installation.

### Multiple Versions

This workflow completely eliminates version conflicts by using isolated instances for each test session.

### Cache Issues

Fresh instances start with no cache, eliminating cache-related problems.

## Benefits of Fresh Instance Approach

### Complete Isolation

- No interference with your main VS Code setup
- No risk of corrupting your development environment
- Each test starts with a clean slate

### Realistic Testing

- Tests installation process in clean environment
- Catches issues that only appear in fresh installations
- Mimics end-user experience

### No Cleanup Required

- Automatic cleanup of test data
- No manual uninstallation needed
- No leftover files or configurations

### Development Safety

- Your main VS Code instance remains untouched
- No need for admin privileges
- No risk of breaking your daily workflow

## File Structure

```
scripts/
  dev-start.js       # Fresh development instance launcher
  dev-test.js        # Fresh test environment runner
  dev-clean.js       # Cleanup utility
```

Temporary files created (auto-cleaned):

- `synthwave-dark-dev.vsix` - Development package
- `.vscode-test-*` - Downloaded VS Code instances
- `.vscode-test-data-*` - Isolated user data directories
