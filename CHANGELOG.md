# Change Log

All notable changes to the "SynthWave Dark" VS Code theme extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.1.2] - 2025-05-31

### Fixed

- Fixed glow effects initialization and theme detection
- Improved workbench HTML injection reliability
- Enhanced VS Code version compatibility checking

### Changed

- Improved Apple Intelligence gradient animation performance
- Optimized CSS injection and cleanup processes
- Enhanced glow effect token replacement logic

## [1.1.1] - 2025-05-31

### Added

- Apple Intelligence inspired gradient animations
- Active tab stripe with animated rainbow gradient
- Enhanced activity bar badges with multi-color gradients
- Support for Apple Intelligence placeholder text color (`#fc0303`)

### Enhanced

- Improved glow effect implementation with better browser compatibility
- Enhanced theme detection and initialization logic
- Added comprehensive CSS variable system for Apple Intelligence colors

### Technical

- Refactored glow.js for better performance and reliability
- Added CSS custom properties for gradient management
- Improved MutationObserver handling for theme changes

## [1.1.0] - 2025-05-31

### Added

- JavaScript-based glow effect implementation (glow.ts)
- Dynamic theme style injection and replacement
- Comprehensive token replacement system for glow effects
- Enhanced CSS styling with Apple Intelligence color palette
- Improved VS Code version compatibility detection

### Features

- **Glow Effects**: Complete rewrite of glow implementation using TypeScript
- **Apple Intelligence Integration**: Support for Apple Intelligence color scheme
- **Dynamic Styling**: Real-time theme style injection and modification
- **Version Compatibility**: Enhanced checking for VS Code version support

### Technical

- Migrated from CSS-only to JavaScript-based glow implementation
- Added MutationObserver for dynamic theme loading
- Implemented token replacement system for syntax highlighting glow
- Enhanced workbench HTML modification with proper cleanup

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
