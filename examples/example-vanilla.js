/**
 * SynthWave Dark Theme - Vanilla JavaScript Showcase
 *
 * This file demonstrates JavaScript syntax highlighting features
 * of the SynthWave Dark VS Code theme.
 *
 * Author: Sammy Kumar
 * Theme: SynthWave Dark
 */

// ===== COMMENTS =====
// Single line comment
/*
 * Multi-line comment block
 * Demonstrates italic styling for comments
 */

// ===== VARIABLES AND CONSTANTS =====
const PI = 3.14159;
const THEME_NAME = "SynthWave Dark";
let counter = 0;
var legacyVariable = "old-school";

// ===== PRIMITIVE TYPES =====
const stringLiteral = "Hello World";
const templateLiteral = `Theme: ${THEME_NAME}`;
const numberLiteral = 42;
const floatLiteral = 3.14159;
const booleanTrue = true;
const booleanFalse = false;
const nullValue = null;
const undefinedValue = undefined;

// ===== ARRAYS AND OBJECTS =====
const colors = ["#f92672", "#66d9ef", "#e6db74", "#ae81ff"];
const themeConfig = {
  name: "SynthWave Dark",
  version: "1.1.0",
  neonGlow: true,
  colors: {
    pink: "#f92672",
    cyan: "#66d9ef",
    yellow: "#e6db74",
    purple: "#ae81ff"
  }
};

// ===== FUNCTIONS =====
function traditionalFunction(param1, param2) {
  return param1 + param2;
}

const arrowFunction = (x, y) => x * y;

const asyncFunction = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// ===== CLASSES =====
class ThemeManager {
  constructor(themeName) {
    this.currentTheme = themeName;
    this.isGlowEnabled = false;
  }

  enableGlow() {
    this.isGlowEnabled = true;
    console.log("Neon glow enabled!");
  }

  static getDefaultTheme() {
    return "SynthWave Dark";
  }

  get theme() {
    return this.currentTheme;
  }

  set theme(newTheme) {
    this.currentTheme = newTheme;
  }
}

// ===== CONTROL FLOW =====
if (themeConfig.neonGlow) {
  console.log("Glow effects are enabled");
} else if (themeConfig.name === "Light Theme") {
  console.log("Using light theme");
} else {
  console.log("Using default theme");
}

// Switch statement
switch (themeConfig.name) {
  case "SynthWave Dark":
    console.log("🌈 Neon dreams activated!");
    break;
  case "Monokai":
    console.log("Classic dark theme");
    break;
  default:
    console.log("Unknown theme");
}

// ===== LOOPS =====
for (let i = 0; i < colors.length; i++) {
  console.log(`Color ${i}: ${colors[i]}`);
}

for (const color of colors) {
  console.log(`Processing color: ${color}`);
}

colors.forEach((color, index) => {
  console.log(`${index}: ${color}`);
});

// ===== DESTRUCTURING =====
const { name, version, colors: themeColors } = themeConfig;
const [firstColor, secondColor, ...restColors] = colors;

// ===== SPREAD OPERATOR =====
const newColors = [...colors, "#4ade80"];
const extendedConfig = {
  ...themeConfig,
  author: "Sammy Kumar",
  glow: true
};

// ===== REGULAR EXPRESSIONS =====
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== PROMISES =====
const fetchThemeData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve({ theme: "SynthWave Dark", status: "loaded" });
      } else {
        reject(new Error("Failed to load theme"));
      }
    }, 1000);
  });
};

// ===== ERROR HANDLING =====
try {
  const result = JSON.parse('{"theme": "SynthWave Dark"}');
  console.log("Parsed theme data:", result);
} catch (error) {
  console.error("JSON parsing failed:", error.message);
} finally {
  console.log("Theme loading complete");
}

// ===== MODULES (ES6) =====
// export default ThemeManager;
// export { colors, themeConfig, fetchThemeData };

// ===== EVENT HANDLING =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing theme...");
  
  const themeManager = new ThemeManager("SynthWave Dark");
  themeManager.enableGlow();
  
  // Simulate theme changes
  setInterval(() => {
    counter++;
    console.log(`Theme tick: ${counter}`);
  }, 2000);
});

// ===== MATHEMATICAL OPERATIONS =====
const calculations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : NaN,
  power: (base, exponent) => Math.pow(base, exponent),
  percentage: (value, total) => (value / total) * 100
};

// ===== CLOSURE EXAMPLE =====
function createColorGenerator() {
  let colorIndex = 0;
  
  return function() {
    const color = colors[colorIndex % colors.length];
    colorIndex++;
    return color;
  };
}

const nextColor = createColorGenerator();

// ===== ADVANCED FEATURES =====
const proxy = new Proxy(themeConfig, {
  get(target, property) {
    console.log(`Accessing ${property}`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`Setting ${property} to ${value}`);
    target[property] = value;
    return true;
  }
});

// ===== SYMBOLS =====
const themeSymbol = Symbol("theme");
const secretConfig = {
  [themeSymbol]: "hidden theme data"
};

console.log("🌈 SynthWave Dark JavaScript showcase complete!");