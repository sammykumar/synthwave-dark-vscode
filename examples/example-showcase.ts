/**
 * SynthWave Dark Theme - TextMate Scopes Showcase
 *
 * This file demonstrates all the syntax highlighting features
 * of the SynthWave Dark VS Code theme.
 *
 * Author: Sammy Kumar
 * Theme: SynthWave 84
 */

// ===== COMMENTS =====
// Single line comment (scope: comment)
/*
 * Multi-line comment block
 * Demonstrates italic styling for comments
 */

// ===== IMPORTS/EXPORTS =====
import * as vscode from "vscode";
import * as fs from "fs";
import { EventEmitter } from "events";

// ===== STORAGE MODIFIERS =====
const readonlyValue = "immutable";
let mutableVariable = 42;
var legacyVariable: string;

// ===== LANGUAGE VARIABLES IN CONTEXT =====
class BaseClass {
  protected value = "base";

  constructor() {
    console.log(this); // 'this' keyword in context
  }

  protected baseMethod(): void {
    console.log("Base method");
  }
}

class ExtendedClass extends BaseClass {
  constructor() {
    super(); // 'super' keyword in context
    console.log(this.value);
  }

  public method(): void {
    super.baseMethod(); // 'super' method call
  }

  // Function using arguments object
  public variableArgs(): void {
    function innerFunction() {
      // Using arguments in function scope
      if (arguments.length > 0) {
        console.log("Arguments provided");
      }
    }
    innerFunction();
  }
}

// ===== CONSTANTS =====
const PI = 3.14159; // Numeric constant
const THEME_NAME = "SynthWave Dark"; // String constant
const isEnabled = true; // Boolean constant
const nullValue = null; // Null constant
const undefinedValue = undefined; // Undefined constant

// ===== NUMBERS =====
const decimal = 42;
const float = 3.14159;
const hex = 0xff;
const binary = 0b1010;
const octal = 0o755;
const scientific = 1.23e-4;

// ===== STRINGS AND TEMPLATES =====
const singleQuoted = "Hello World";
const doubleQuoted = "SynthWave Theme";
const templateString = `Theme name: ${THEME_NAME}`;
const multilineTemplate = `
  This is a multiline
  template string with ${PI}
`;

// ===== REGULAR EXPRESSIONS =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /\d{3}-\d{3}-\d{4}/g;

// ===== CHARACTER ESCAPES =====
const escapedString = "Line 1\nLine 2\tTabbed\r\nWindows Line";
const unicodeString = "\u0041\u0042\u0043"; // ABC
const hexEscape = "\x41\x42\x43"; // ABC

// ===== FUNCTIONS =====
function regularFunction(param1: string, param2?: number): boolean {
  return param1.length > (param2 || 0);
}

const arrowFunction = (x: number, y: number) => x + y;

async function asyncFunction(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

function* generatorFunction(): Generator<number> {
  yield 1;
  yield 2;
  yield 3;
}

// ===== CLASSES AND INTERFACES =====
interface ThemeConfig {
  name: string;
  version: string;
  colors: Record<string, string>;
}

abstract class BaseTheme {
  protected abstract getName(): string;
}

class SynthwaveTheme extends BaseTheme implements ThemeConfig {
  public name = "SynthWave Dark";
  public version = "1.1.0";
  public colors = {
    primary: "#F92672",
    secondary: "#66D9EF",
    accent: "#A6E22E",
  };

  constructor(private config?: Partial<ThemeConfig>) {
    super();
  }

  protected getName(): string {
    return this.name;
  }

  public getColor(key: string): string | undefined {
    return this.colors[key as keyof typeof this.colors];
  }
}

// ===== OBJECT LITERALS =====
const themeSettings = {
  background: "#0A0A0A",
  foreground: "#F8F8F2",
  cursor: "#4ade80",
  enabled: true,
  opacity: 0.95,
};

// ===== DESTRUCTURING =====
const { name, version } = new SynthwaveTheme();
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// ===== OPERATORS =====
const addition = 5 + 3;
const subtraction = 10 - 4;
const multiplication = 6 * 7;
const division = 15 / 3;
const modulo = 17 % 5;
const exponentiation = 2 ** 8;

// Logical operators
const and = true && false;
const or = true || false;
const not = !true;

// Comparison operators
const equal = 5 === 5;
const notEqual = (5 as number) !== (4 as number); // Type assertion to avoid literal type comparison
const greater = 10 > 5;
const less = 3 < 7;

// Assignment operators
let counter = 0;
counter += 5;
counter -= 2;
counter *= 3;
counter /= 2;

// ===== CONTROL FLOW =====
if (isEnabled) {
  console.log("Theme is enabled");
} else if (version === "1.0.0") {
  console.log("Old version");
} else {
  console.log("Unknown state");
}

// Switch statement
switch (name) {
  case "SynthWave Dark":
    console.log("Current theme");
    break;
  case "Monokai":
    console.log("Alternative theme");
    break;
  default:
    console.log("Unknown theme");
}

// Loops
for (let i = 0; i < 10; i++) {
  console.log(`Iteration ${i}`);
}

for (const key in themeSettings) {
  console.log(`${key}: ${themeSettings[key as keyof typeof themeSettings]}`);
}

for (const color of Object.values(themeSettings)) {
  console.log(color);
}

while (counter > 0) {
  counter--;
}

do {
  console.log("Execute at least once");
} while (false);

// ===== TRY/CATCH =====
try {
  throw new Error("Something went wrong");
} catch (error) {
  console.error("Caught error:", error);
} finally {
  console.log("Cleanup");
}

// ===== ASYNC/AWAIT =====
async function fetchThemeData(): Promise<ThemeConfig> {
  try {
    const response = await fetch("/api/theme");
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch theme: ${error}`);
  }
}

// ===== GENERICS =====
function identity<T>(arg: T): T {
  return arg;
}

interface Container<T> {
  value: T;
}

class GenericClass<T, U> {
  constructor(private first: T, private second: U) {}

  getFirst(): T {
    return this.first;
  }

  getSecond(): U {
    return this.second;
  }
}

// ===== DECORATORS =====
function log(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor | void {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with`, args);
    return method.apply(this, args);
  };
  return descriptor;
}

class LoggedClass {
  public doSomething(value: string): void {
    console.log("Doing something with", value);
  }
}

// ===== TYPE ANNOTATIONS =====
type ThemeColor = string;
type ThemeMode = "light" | "dark";
type EventHandler<T> = (event: T) => void;

interface EventTarget {
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventHandler<HTMLElementEventMap[K]>
  ): void;
}

// ===== ENUMS =====
enum ThemeType {
  Light = "light",
  Dark = "dark",
  HighContrast = "high-contrast",
}

const enum InlineEnum {
  Red = "#FF0000",
  Green = "#00FF00",
  Blue = "#0000FF",
}

// ===== NAMESPACE =====
namespace ThemeUtilities {
  export function hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  }

  export const DEFAULT_COLORS = {
    primary: "#F92672",
    secondary: "#66D9EF",
  };
}

// ===== MODULES REMOVED (causes error without actual module) =====

// ===== JSX (if React types are available) =====
/*
const ThemeComponent: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div className="theme-container" data-theme={theme}>
      <h1>SynthWave Dark Theme</h1>
      <p>A beautiful dark theme with neon accents</p>
    </div>
  );
};
*/

// ===== ADVANCED TYPES =====
type PartialTheme<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type ThemeKeys = keyof typeof themeSettings;
type ThemeValues = (typeof themeSettings)[ThemeKeys];

// ===== UTILITY FUNCTIONS =====
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ===== TEMPLATE LITERALS WITH EXPRESSIONS =====
const createThemeCSS = (colors: Record<string, string>) => `
  :root {
    ${Object.entries(colors)
      .map(([key, value]) => `--color-${key}: ${value};`)
      .join("\n    ")}
  }
  
  .synthwave-theme {
    background: var(--color-background);
    color: var(--color-foreground);
  }
`;

// ===== OBJECT METHODS =====
const themeManager = {
  currentTheme: "SynthWave Dark",

  setTheme(themeName: string): void {
    this.currentTheme = themeName;
    console.log(`Theme changed to: ${this.currentTheme}`);
  },

  getTheme(): string {
    return this.currentTheme;
  },

  // Computed property name
  [`get${THEME_NAME.replace(/\s+/g, "")}Settings`](): ThemeConfig {
    return {
      name: this.currentTheme,
      version: "1.1.0",
      colors: {
        background: themeSettings.background,
        foreground: themeSettings.foreground,
        cursor: themeSettings.cursor,
      },
    };
  },
};

// ===== SYMBOL =====
const themeSymbol = Symbol("theme-identifier");
const globalSymbol = Symbol.for("global-theme");

// ===== PROXY =====
const themeProxy = new Proxy(themeSettings, {
  get(target, prop) {
    console.log(`Accessing property: ${String(prop)}`);
    return target[prop as keyof typeof target];
  },
  set(target, prop, value) {
    console.log(`Setting ${String(prop)} to ${value}`);
    (target as any)[prop] = value;
    return true;
  },
});

// ===== WEAK COLLECTIONS =====
const themeCache = new WeakMap<object, ThemeConfig>();
const activeThemes = new WeakSet<SynthwaveTheme>();

// ===== BIGINT =====
const bigNumber = 9007199254740991n;
const anotherBig = BigInt("12345678901234567890");

// ===== OPTIONAL CHAINING & NULLISH COALESCING =====
const userPreferences = {
  theme: {
    mode: "dark" as const,
    colors: null,
  },
};

const themeMode = userPreferences?.theme?.mode ?? "light";
const themeColors =
  userPreferences?.theme?.colors ?? ThemeUtilities.DEFAULT_COLORS;

// ===== TAGGED TEMPLATE LITERALS =====
function css(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");
}

const buttonStyles = css`
  background: ${ThemeUtilities.DEFAULT_COLORS.primary};
  color: ${themeSettings.foreground};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
`;

// ===== EXPORT STATEMENT =====
export { SynthwaveTheme, ThemeType, themeManager, ThemeUtilities };

export type { ThemeConfig, ThemeColor, ThemeMode };

// Default export
export default {
  theme: new SynthwaveTheme(),
  utils: ThemeUtilities,
  version: "1.1.0",
};
