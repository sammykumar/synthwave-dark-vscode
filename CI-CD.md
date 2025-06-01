# CI/CD Pipeline

This repository includes an automated CI/CD pipeline using GitHub Actions that builds and publishes the VS Code extension to the marketplace when the master branch is updated.

## Pipeline Overview

The pipeline consists of two main jobs:

### Test Job
Runs on all pushes and pull requests to the master branch:
- Sets up Node.js environment
- Installs dependencies 
- Performs type checking with TypeScript
- Runs ESLint for code quality
- Builds the extension package
- Runs automated tests

### Publish Job
Runs only on pushes to the master branch (after tests pass):
- Builds the extension
- Automatically determines version bump based on commit message
- Publishes to VS Code Marketplace using `@vscode/vsce`

## Version Bumping

The pipeline automatically determines the semantic version bump based on commit messages:

- **Major version**: Include `[major]`, `BREAKING`, or `breaking` in commit message
- **Minor version**: Include `[minor]`, `feat`, or `feature` in commit message  
- **Patch version**: Default for all other commits

Examples:
```bash
git commit -m "feat: add new glow effects [minor]"     # Minor bump
git commit -m "BREAKING: remove deprecated API"       # Major bump
git commit -m "fix: resolve theme color issue"        # Patch bump
```

## Setup Requirements

To enable automatic publishing, you need to configure the `VSCE_PAT` secret in GitHub:

1. Get a Personal Access Token from Azure DevOps (used by VS Code Marketplace)
2. Go to your repository Settings → Secrets and variables → Actions
3. Add a new secret named `VSCE_PAT` with your token

## Manual Publishing

You can still publish manually using npm scripts:

```bash
npm run publish:patch   # Patch version bump
npm run publish:minor   # Minor version bump  
npm run publish:major   # Major version bump
```

## Workflow File

The complete workflow is defined in `.github/workflows/ci-cd.yml`.