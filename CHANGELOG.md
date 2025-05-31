# Change Log

All notable changes to the "SynthWave Dark" VS Code theme extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.1] - 2025-05-31

### Added

- Dark Synthwave/Monokai inspired color theme
- Configurable neon glow effects for enhanced retro experience
- Commands for enabling glow effects and cleaning up workbench HTML
- Support for JavaScript/TypeScript syntax highlighting
- Optimized theme colors for dark backgrounds with vibrant accents
- Comprehensive semantic highlighting support

### Features

- **Theme**: SynthWave 84 color theme with carefully crafted Monokai-inspired palette
- **Glow Effects**: Optional neon glow effects (disabled by default)
- **Commands**:
  - `Synthwave Dark: Enable Glow` - Enables neon glow effects
  - `Synthwave Dark: Clean Up Workbench HTML` - Removes glow effect modifications
- **Configuration**: Setting to enable/disable glow effects through VS Code preferences
- **Compatibility**: Requires VS Code ^1.100.0, glow effects require VS Code 1.12.0 or newer

### Technical

- Built with TypeScript and esbuild for optimal performance
- Semver dependency for version checking
- ESLint configuration for code quality
- Comprehensive test suite with Mocha
- NPM scripts for development, building, and publishing

### UI Enhancements

- Activity bar with neon pink accents and dark background
- Editor with carefully balanced contrast for readability
- Sidebar and panel styling with consistent color scheme
- Error and warning highlighting with appropriate colors
- Support for diff editor with subtle background highlighting
- Terminal styling with theme-consistent colors

### Syntax Highlighting

- Enhanced support for JavaScript/TypeScript
- Keyword highlighting with vibrant pink (`#F92672`)
- String highlighting with yellow (`#E6DB74`)
- Comment styling with muted colors
- Function and variable name distinction
- Proper highlighting for operators and punctuation

## [1.0.0] - Initial Release

### Added

- Initial release of SynthWave Dark theme
- Basic color scheme implementation
- Extension infrastructure and build setup
- Core theme files and configuration
- Marketplace publishing setup
