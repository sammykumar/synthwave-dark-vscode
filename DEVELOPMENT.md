# Development Guide

This guide covers the development workflow, testing, and CI/CD pipeline for the SynthWave Dark VS Code extension.

## Development Workflow

### Recommended Feature Development Process

#### 1. Feature Branch Development

```bash
# Create and checkout a new feature branch
git checkout -b feat/new-glow-effects

# Make your changes (code, tests, documentation)...

# When ready to create a release candidate:
npm run feature:patch  # or minor/major as appropriate
```

**What the feature script does:**

- Builds and packages the extension (`npm run package`)
- Bumps the version in `package.json` and `package-lock.json`
- Commits the version change with a standardized message
- Pushes the feature branch to origin
- Automatically creates a Pull Request to `master` using GitHub CLI

#### 2. Pull Request Process

- The PR is automatically created with `--fill` (uses commit messages and branch name)
- CI will run tests on the PR (as configured in the workflow)
- Get review and approval
- Merge to master

#### 3. Publishing Release

After your PR is merged to master:

```bash
# Switch to master and pull the merged changes
git checkout master
git pull origin master

# Create and push a git tag to trigger CI/CD publishing
npm run release:current
```

### Feature Development Scripts

The project includes automated feature development scripts that handle the complete workflow:

- **`npm run feature:patch`** - Complete workflow with patch version bump (1.0.0 → 1.0.1)
- **`npm run feature:minor`** - Complete workflow with minor version bump (1.0.0 → 1.1.0)
- **`npm run feature:major`** - Complete workflow with major version bump (1.0.0 → 2.0.0)

Each script performs:

1. `npm run package` - Build and package the extension
2. Version bump (patch/minor/major)
3. Git add both `package.json` and `package-lock.json`
4. Git commit with standardized message
5. Push feature branch to origin
6. Create Pull Request using `gh pr create --base master --fill`

### Manual Version Management

If you need more granular control, you can use individual scripts:

```bash
# Version-only operations (no git operations)
npm run version:patch   # Just bump patch version in package.json
npm run version:minor   # Just bump minor version in package.json
npm run version:major   # Just bump major version in package.json

# Release operations (git tag and push)
npm run release:tag     # Create and push git tag for current version
npm run release:current # Alias for release:tag
```

## Testing

### Running Tests Locally

```bash
# Install dependencies
npm ci

# Run type checking
npm run check-types

# Run linting
npm run lint

# Build the extension
npm run package

# Run all tests
npm test
```

### Test Scripts Available

- `npm run check-types` - TypeScript type checking without compilation
- `npm run lint` - ESLint code quality checks
- `npm run test` - Run the full test suite
- `npm run pretest` - Runs cleanup, compilation, and lint before tests

### Test Structure

Tests are located in `src/test/` and include:

- **Extension Test Suite** (`extension.test.ts`):
  - Extension installation verification
  - Extension activation testing
  - Command registration verification
  - Deactivation testing

### Development Watching

For active development, you can use watch modes:

```bash
# Watch TypeScript compilation and esbuild
npm run watch

# Or run individually:
npm run watch:tsc     # TypeScript watch mode
npm run watch:esbuild # esbuild watch mode
npm run watch-tests   # Test compilation watch mode
```

## CI/CD Pipeline

This repository includes an automated CI/CD pipeline using GitHub Actions that builds and publishes the VS Code extension to the marketplace.

### Pipeline Overview

The pipeline consists of two main jobs:

#### Test Job

Runs on all pushes and pull requests to the master branch:

- Sets up Node.js environment
- Installs dependencies
- Performs type checking with TypeScript
- Runs ESLint for code quality
- Builds the extension package
- Runs automated tests

#### Publish Job

Runs only when a git tag with format `v*` is pushed (after tests pass):

- Builds the extension
- Extracts version from the git tag
- Publishes to VS Code Marketplace using `@vscode/vsce` with the exact version from package.json

### Version Management

The pipeline uses a manual version management approach with git tags:

1. **Update package.json**: Use `npm version` to update the version in `package.json` using semantic versioning
2. **Commit changes**: Commit your changes including the version bump
3. **Create git tag**: The `npm version` command automatically creates a git tag with the format `v{major}.{minor}.{patch}`
4. **Push tag**: Push the tag to trigger the publishing pipeline

#### Example Version Management:

```bash
# On feature branch - bump version with your changes
npm version patch  # Creates commit and tag automatically
git push origin feat/my-feature --no-tags  # Push branch without tag

# After PR is merged to master:
git checkout master
git pull origin master
git push origin v1.2.3  # Push the tag to trigger publishing
```

**Note**: The pipeline will only publish when a tag starting with `v` is pushed. The version in `package.json` must match the tag version (without the `v` prefix) for successful publishing.

### Setup Requirements

To enable automatic publishing, you need to configure the `VSCE_PAT` secret in GitHub:

1. Get a Personal Access Token from Azure DevOps (used by VS Code Marketplace)
2. Go to your repository Settings → Secrets and variables → Actions
3. Add a new secret named `VSCE_PAT` with your token

### Manual Publishing

You can still publish manually using the legacy vsce commands if needed:

```bash
npm run vsce:publish    # Direct publish (bypasses automation)
```

However, the recommended approach is to use the automated pipeline with git tags as described above.

## Automated Scripts

The following npm scripts are available to streamline development:

### Feature Development Scripts

```bash
# Complete automated feature development workflow
npm run feature:patch   # Build → patch version bump → commit → push → create PR
npm run feature:minor   # Build → minor version bump → commit → push → create PR
npm run feature:major   # Build → major version bump → commit → push → create PR
```

### Version Management Scripts

```bash
# Version-only operations (no git operations)
npm run version:patch   # Bump patch version in package.json only
npm run version:minor   # Bump minor version in package.json only
npm run version:major   # Bump major version in package.json only
```

### Release Scripts

```bash
# Git tag operations for triggering CI/CD publishing
npm run release:tag     # Create and push git tag for current version
npm run release:current # Alias for release:tag
```

### How the Scripts Work

**Feature Scripts (`feature:*`):**

1. Run `npm run package` to build the extension
2. Bump version using `npm version` (patch/minor/major)
3. Stage both `package.json` and `package-lock.json`
4. Commit with message: `"chore: bump version to {version}"`
5. Push the current branch to origin
6. Create Pull Request using `gh pr create --base master --fill`

**Version Scripts (`version:*`):**

- Only update the version in `package.json` using `npm version --no-git-tag-version`
- No git operations performed

**Release Scripts (`release:*`):**

- Create git tag with format `v{version}` from current `package.json` version
- Push the tag to origin to trigger CI/CD publishing pipeline

## Build Scripts

### Core Build Scripts

- `npm run compile` - Compile TypeScript and run checks
- `npm run package` - Build production package
- `npm run vscode:prepublish` - Prepublish hook (runs package)
- `npm run clean` - Clean build artifacts
- `npm run clean-test` - Clean test artifacts

### Legacy VSCE Scripts

- `npm run vsce:package` - Create VSIX package
- `npm run vsce:publish` - Direct publish to marketplace (bypasses automation)

### Development Scripts

- `npm run watch` - Run all watch modes in parallel
- `npm run watch:esbuild` - Watch and rebuild with esbuild
- `npm run watch:tsc` - Watch TypeScript compilation
- `npm run compile-tests` - Compile test files

## Project Structure

```
src/
├── extension.ts          # Main extension entry point
├── css/
│   └── global.css       # CSS for glow effects
├── js/
│   └── glow.ts          # Glow functionality implementation
├── test/
│   └── extension.test.ts # Extension tests
└── utils/               # Utility functions

themes/
└── synthwave-color-theme.json # Theme definition

assets/                  # Icons and images
examples/               # Theme examples and showcases
```

## Workflow File

The complete CI/CD workflow is defined in `.github/workflows/ci-cd.yml`.

## Contributing

1. Fork the repository
2. Create a feature branch following the naming convention `feat/your-feature-name`
3. Follow the development workflow outlined above
4. Ensure all tests pass
5. Submit a pull request

For more information about VS Code extension development, see the [official documentation](https://code.visualstudio.com/api).
