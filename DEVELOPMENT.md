# Development Guide

This guide covers the development workflow, testing, and CI/CD pipeline for the SynthWave Dark VS Code extension.

## Development Workflow

### Recommended Feature Development Process

#### 1. Feature Branch Development

```bash
# Create and checkout a new feature branch
git checkout -b feat/new-glow-effects

# Make your changes...
# When ready to bump version:
npm version patch  # or minor/major as appropriate
# This updates package.json and creates a git commit + tag automatically

# Push your feature branch (without the tag)
git push origin feat/new-glow-effects --no-tags
```

#### 2. Pull Request Process

- Open a PR from `feat/new-glow-effects` to `master`
- The CI will run tests on the PR (as configured in the workflow)
- Get review and approval
- Merge to master

#### 3. Publishing Release

```bash
# Switch to master and pull the merged changes
git checkout master
git pull origin master

# Now push the version tag to trigger publishing
git push origin v1.2.3  # whatever version was created by npm version
```

### Alternative Workflow (Version Bump on Master)

If you prefer to keep version bumps separate from features:

```bash
# After merging feature to master:
git checkout master
git pull origin master

# Bump version on master
npm version patch --no-git-tag-version
git add package.json
git commit -m "chore: bump version to 1.2.3"

# Create and push tag
git tag v1.2.3
git push origin master
git push origin v1.2.3
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

You can still publish manually using npm scripts if needed:

```bash
npm run publish:patch   # Patch version bump
npm run publish:minor   # Minor version bump
npm run publish:major   # Major version bump
```

However, the recommended approach is to use the automated pipeline with git tags as described above.

## Build Scripts

### Available Scripts

- `npm run compile` - Compile TypeScript and run checks
- `npm run package` - Build production package
- `npm run vscode:prepublish` - Prepublish hook (runs package)
- `npm run vsce:package` - Create VSIX package
- `npm run vsce:publish` - Publish to marketplace
- `npm run clean` - Clean build artifacts
- `npm run clean-test` - Clean test artifacts

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
