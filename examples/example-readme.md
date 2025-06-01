# 🌈 SynthWave Dark VS Code Theme

**A retro-futuristic theme with neon glow effects that brings 80s aesthetics to your modern development workflow.**

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=SammyKumar.synthwave-dark-vscode)
[![GitHub Stars](https://img.shields.io/github/stars/sammykumar/synthwave-dark-vscode?style=for-the-badge&logo=github)](https://github.com/sammykumar/synthwave-dark-vscode)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/SammyKumar.synthwave-dark-vscode?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=SammyKumar.synthwave-dark-vscode)

---

## ✨ Features

- **🌟 Neon Glow Effects**: Optional CSS injection for that authentic retro feel
- **🎨 Vibrant Color Palette**: Carefully crafted colors inspired by 80s synthwave aesthetics  
- **💻 Multi-Language Support**: Optimized for JavaScript, TypeScript, Python, CSS, HTML, and more
- **⚡ Performance Optimized**: Lightweight theme with smooth animations
- **🔧 Customizable**: Adjust glow intensity and colors to your preference

## 🚀 Installation

### Method 1: VS Code Marketplace (Recommended)

1. Open **VS Code**
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for `"SynthWave Dark"`
4. Click **Install**
5. Select the theme from **File → Preferences → Color Theme**

### Method 2: Command Line

```bash
code --install-extension SammyKumar.synthwave-dark-vscode
```

### Method 3: Manual Installation

1. Download the `.vsix` file from [Releases](https://github.com/sammykumar/synthwave-dark-vscode/releases)
2. Open VS Code
3. Run `Extensions: Install from VSIX...` command
4. Select the downloaded file

## 🎮 Quick Start

Once installed, activate the theme:

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type `"Preferences: Color Theme"`
3. Select `"SynthWave 84"`

### Enable Neon Glow Effects

To enable the signature neon glow effects:

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run `"SynthWave Dark: Enable Glow"`
3. **Restart VS Code**

> ⚠️ **Note**: Glow effects modify VS Code's CSS. You may see an "unsupported" warning, which is normal and safe to ignore.

## 🎨 Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| 🌸 **Neon Pink** | `#f92672` | Keywords, Functions |
| 🔵 **Neon Cyan** | `#66d9ef` | Types, Classes |
| 💛 **Neon Yellow** | `#e6db74` | Strings, Constants |
| 💜 **Neon Purple** | `#ae81ff` | Numbers, Booleans |
| 💚 **Neon Green** | `#4ade80` | Comments, Success |

## 📸 Screenshots

### JavaScript/TypeScript
```javascript
// SynthWave Dark in action
const synthwaveTheme = {
  name: 'SynthWave Dark',
  colors: ['#f92672', '#66d9ef', '#e6db74', '#ae81ff'],
  glowEnabled: true
};

class ThemeManager {
  constructor() {
    this.currentTheme = 'synthwave';
  }
  
  async enableGlow() {
    console.log('🌈 Neon dreams activated!');
    return true;
  }
}
```

### Python
```python
# Beautiful Python syntax highlighting
import os
import json
from typing import List, Dict, Optional

class SynthWaveConfig:
    def __init__(self, enable_glow: bool = False):
        self.enable_glow = enable_glow
        self.colors = {
            'pink': '#f92672',
            'cyan': '#66d9ef', 
            'yellow': '#e6db74',
            'purple': '#ae81ff'
        }
    
    def apply_theme(self) -> Dict[str, str]:
        """Apply the SynthWave theme configuration."""
        if self.enable_glow:
            print("✨ Enabling neon glow effects...")
        
        return self.colors
```

### CSS
```css
/* Neon-powered CSS */
.synthwave-button {
  background: linear-gradient(45deg, #f92672, #66d9ef);
  color: #ffffff;
  border: 2px solid #ae81ff;
  border-radius: 8px;
  padding: 12px 24px;
  text-shadow: 
    0 0 10px #f92672,
    0 0 20px #f92672,
    0 0 30px #f92672;
  transition: all 0.3s ease;
}

.synthwave-button:hover {
  transform: scale(1.05);
  box-shadow: 
    0 0 20px #66d9ef,
    0 0 40px #66d9ef;
}
```

## ⚙️ Configuration

### Settings

Add these to your VS Code `settings.json`:

```json
{
  "synthwaveDark.enableGlow": true,
  "synthwaveDark.glowIntensity": 75,
  "synthwaveDark.animatedGlow": true,
  "synthwaveDark.customColors": {
    "neonPink": "#f92672",
    "neonCyan": "#66d9ef",
    "neonYellow": "#e6db74", 
    "neonPurple": "#ae81ff",
    "neonGreen": "#4ade80"
  }
}
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Alt+G` | Toggle neon glow |
| `Ctrl+Shift+P` → `SynthWave Dark: Enable Glow` | Enable glow effects |
| `Ctrl+Shift+P` → `SynthWave Dark: Cleanup` | Remove glow modifications |

## 🔧 Advanced Usage

### Custom Glow Intensity

```json
{
  "synthwaveDark.glowIntensity": 100
}
```

Values: `0` (no glow) to `100` (maximum glow)

### Disable Specific Effects

```json
{
  "synthwaveDark.animatedGlow": false,
  "synthwaveDark.enableGlow": false
}
```

## 🌐 Language Support

SynthWave Dark provides optimized highlighting for:

- **Frontend**: HTML, CSS, SCSS, JavaScript, TypeScript, React, Vue, Angular
- **Backend**: Python, Node.js, PHP, Ruby, Go, Rust, C++, C#, Java
- **Data**: JSON, YAML, XML, SQL, GraphQL
- **Config**: Dockerfile, .env, .gitignore, package.json
- **Markup**: Markdown, reStructuredText
- **Shell**: Bash, PowerShell, Zsh

## 🚨 Troubleshooting

### Common Issues

#### "Unsupported" Warning After Enabling Glow

This is **normal** and **safe**. VS Code shows this warning when CSS is modified. The theme works perfectly.

**Solution**: Click "Don't Show Again" or ignore the warning.

#### Glow Effects Not Working

1. **Restart VS Code** completely
2. Run `"SynthWave Dark: Enable Glow"` again  
3. Check that `synthwaveDark.enableGlow` is `true` in settings

#### Theme Not Applying

1. **Reload Window**: `Ctrl+Shift+P` → `"Developer: Reload Window"`
2. **Check Theme Selection**: File → Preferences → Color Theme → "SynthWave 84"
3. **Reinstall Extension** if issues persist

### Reset to Default

To completely reset the theme:

```bash
# Remove glow effects
code --command "synthwave-dark.cleanup"

# Reset settings
# Remove synthwaveDark.* entries from settings.json
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/sammykumar/synthwave-dark-vscode.git
cd synthwave-dark-vscode

# Install dependencies
npm install

# Start development
npm run watch
```

### Building

```bash
# Type check
npm run check-types

# Lint code
npm run lint

# Build for production
npm run package
```

### Testing

```bash
# Run tests
npm test

# Test in VS Code
F5 # Opens Extension Development Host
```

## 📝 Changelog

### v1.1.0 - Latest
- ✨ Added customizable glow intensity
- 🎨 Improved color contrast for accessibility
- 🐛 Fixed glow effects on Windows
- 📚 Updated documentation

### v1.0.0
- 🎉 Initial release
- 🌈 Core theme with neon color palette
- ⚡ Optional glow effects
- 💻 Multi-language syntax support

[View Full Changelog](CHANGELOG.md)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Sammy Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👨‍💻 Author

**Sammy Kumar**
- 🌐 Website: [synthwave.dev](https://synthwave.dev)
- 🐙 GitHub: [@sammykumar](https://github.com/sammykumar)
- 🐦 Twitter: [@sammykumar_dev](https://twitter.com/sammykumar_dev)
- 📧 Email: hello@synthwave.dev

## 🙏 Acknowledgments

- Inspired by the **synthwave** and **retrowave** aesthetic movements
- Color palette influenced by **Monokai** and **80s neon** themes
- Special thanks to the VS Code community for feedback and suggestions

## ⭐ Show Your Support

If you like this theme, please:

1. ⭐ **Star this repository**
2. 📝 **Rate it on the VS Code Marketplace**
3. 🐦 **Share it on social media**
4. 🤝 **Contribute to the project**

---

<div align="center">

**🌈 Made with ❤️ for the dev community**

[⬆️ Back to Top](#-synthwave-dark-vs-code-theme)

</div>