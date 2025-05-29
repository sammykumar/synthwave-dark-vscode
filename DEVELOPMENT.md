# Development Workflow

This document explains the improved development workflow for the SynthWave Dark VS Code extension.

## Quick Start

### Option 1: Development Symlink (Recommended for Active Development)

This creates a symbolic link directly to your source code, so changes are reflected immediately:

```bash
npm run dev-link
```

**Benefits:**

- ✅ No packaging needed
- ✅ Instant reload on file changes
- ✅ No version conflicts
- ✅ True development mode

**Use this when:**

- Actively developing features
- Making frequent changes
- Testing theme modifications

### Option 2: Development Package Install

This packages the extension with a fixed filename and installs it:

```bash
npm run dev-install
```

**Benefits:**

- ✅ Tests the full packaging process
- ✅ No version conflicts (always uses `synthwave-dark-dev.vsix`)
- ✅ Mimics production installation

**Use this when:**

- Testing packaging process
- Preparing for release
- Sharing with testers

## Available Commands

### Development Commands

- `npm run dev-link` - Create symlink for live development
- `npm run dev-unlink` - Remove development symlink
- `npm run dev-install` - Package and install development version

### Packaging Commands

- `npm run clean` - Remove all VSIX files
- `npm run package-dev` - Create development package (fixed name)
- `npm run package` - Create versioned package

### Release Commands

- `npm run version:patch` - Increment patch version
- `npm run version:minor` - Increment minor version
- `npm run version:major` - Increment major version
- `npm run package-and-install` - Version, package, and install

### Testing Commands

- `npm run test` - Run extension tests
- `npm run test:watch` - Run tests in watch mode

## Development Workflow

### 1. Initial Setup

```bash
# Clone and setup
git clone <repo>
cd synthwave-dark-vscode
npm install

# Start development
npm run dev-link
```

### 2. Active Development

With `dev-link`, your changes are live. After making changes:

1. Save your files
2. In VS Code Insiders: `Cmd+Shift+P` → "Developer: Reload Window"
3. Your changes are immediately active

### 3. Testing Changes

```bash
# Run tests
npm test

# Test packaging
npm run dev-install
```

### 4. Preparing for Release

```bash
# Remove development symlink
npm run dev-unlink

# Test final package
npm run package-and-install

# Create release
npm run version:patch  # or minor/major
git push && git push --tags
```

## Troubleshooting

### Extension Not Loading

1. Check VS Code Insiders is closed
2. Remove existing installation: `npm run dev-unlink`
3. Try again: `npm run dev-link`

### Permission Errors

Make sure VS Code Insiders is completely closed before running development commands.

### Multiple Versions

The new workflow prevents multiple version conflicts by:

- Using fixed filenames for development
- Cleaning old files automatically
- Using symlinks that replace any existing installation

## File Structure

```
scripts/
  dev-install.js     # Smart development installer
  dev-link.js        # Development symlink creator
  dev-unlink.js      # Development symlink remover
```

Development files created:

- `synthwave-dark-dev.vsix` - Development package (gitignored)
- Symlink in `~/.vscode-insiders/extensions/sammykumar.synthwave-dark-vscode`
