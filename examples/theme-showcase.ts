/**
 * 🌈 SynthWave Dark Theme Showcase
 * A comprehensive TypeScript example showcasing all syntax highlighting features
 * Perfect for screenshots and theme demonstrations
 *
 * This file demonstrates various TypeScript/JavaScript syntax elements
 * to showcase the SynthWave Dark theme's color scheme and highlighting.
 *
 * 🎯 Features Demonstrated:
 * - Interfaces, Types & Generics
 * - Classes & Inheritance
 * - Async/Await & Promises
 * - Template Literals & Tagged Templates
 * - Regular Expressions
 * - Destructuring & Spread Operators
 * - Control Flow (if/else, switch, loops)
 * - Error Handling (try/catch)
 * - Function Declarations & Arrow Functions
 * - Object Literals & Methods
 * - Constants & Variables
 * - Comments (single-line, multi-line, JSDoc)
 * - String/Number/Boolean literals
 * - Import/Export statements
 *
 * Author: Sammy Kumar
 * Theme: SynthWave 84 v1.1.0
 */

import * as fs from "fs";
import { EventEmitter } from "events";

// ==========================================
// 🎯 INTERFACES & TYPES
// ==========================================

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

interface UserFilters {
  limit?: number;
  offset?: number;
  isActive?: boolean;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type UserRole = "admin" | "user" | "moderator";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ApiEndpoint = `/api/v1/${string}`;

// ==========================================
// 🔥 CONSTANTS & ENUMS
// ==========================================

const API_BASE_URL = "https://api.synthwave.dev";
const MAX_RETRIES = 3;
const TIMEOUT_MS = 5000;

enum Status {
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
  TIMEOUT = "timeout",
}

enum ThemeMode {
  LIGHT = 0,
  DARK = 1,
  AUTO = 2,
}

const NEON_COLORS = {
  pink: "#F92672",
  cyan: "#66D9EF",
  yellow: "#E6DB74",
  orange: "#FD971F",
  green: "#A6E22E",
  purple: "#AE81FF",
  red: "#FF5555",
} as const;

// ==========================================
// 🚀 CLASSES & ERROR HANDLING
// ==========================================

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

class SynthwaveApiClient extends EventEmitter {
  private readonly baseUrl: string;
  private retryCount = 0;

  constructor(baseUrl: string = API_BASE_URL) {
    super();
    this.baseUrl = baseUrl;
  }

  async fetchUser(userId: number): Promise<ApiResponse<User>> {
    try {
      // Simulated API call
      const mockUser: User = {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@synthwave.dev`,
        isActive: true,
        createdAt: new Date(),
        metadata: { theme: "synthwave-dark" },
      };

      const response: ApiResponse<User> = {
        data: mockUser,
        status: 200,
        message: "Success",
      };

      this.emit("user:fetched", response.data);
      return response;
    } catch (error) {
      this.handleError(error);
      throw new ApiError(`Failed to fetch user ${userId}`, 404);
    }
  }

  async searchUsers(query: string, filters?: UserFilters): Promise<User[]> {
    const searchParams = new URLSearchParams({
      q: query,
      limit: String(filters?.limit ?? 10),
      offset: String(filters?.offset ?? 0),
    });

    // Simulated search results
    const mockUsers: User[] = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: `${query} User ${i + 1}`,
      email: `${query.toLowerCase()}${i + 1}@synthwave.dev`,
      isActive: Math.random() > 0.5,
      createdAt: new Date(),
    }));

    return mockUsers.filter(
      (user) =>
        filters?.isActive === undefined || user.isActive === filters.isActive
    );
  }

  private handleError(error: unknown): void {
    if (error instanceof Error) {
      console.error(`💥 API Error: ${error.message}`);
      this.emit("error", { message: error.message, timestamp: Date.now() });
    }
  }
}

// ==========================================
// 🎨 ADVANCED TYPESCRIPT FEATURES
// ==========================================

// Generic utility types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type EventMap = {
  "user:created": User;
  "user:updated": { id: number; changes: Partial<User> };
  "user:deleted": { id: number; deletedAt: Date };
  error: { message: string; timestamp: number };
};

// Conditional types and mapped types
type NonNullable<T> = T extends null | undefined ? never : T;
type UserKeys = keyof User;
type RequiredUserData = Required<Pick<User, "id" | "name" | "email">>;

// Template literal types
type WebSocketEvent = `ws:${string}`;

// ==========================================
// 🛠️ FUNCTIONS & ARROW FUNCTIONS
// ==========================================

function createUser(userData: DeepPartial<User>): User {
  const defaultUser: User = {
    id: Math.floor(Math.random() * 1000000),
    name: "",
    email: "",
    isActive: true,
    createdAt: new Date(),
  };

  return { ...defaultUser, ...userData } as User;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatUserName = (user: User): string => `${user.name} <${user.email}>`;

// Higher-order function with generics
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// ==========================================
// 🔮 ASYNC/AWAIT & PROMISES
// ==========================================

async function* userGenerator(userIds: number[]): AsyncGenerator<User> {
  const client = new SynthwaveApiClient();

  for (const id of userIds) {
    try {
      const response = await client.fetchUser(id);
      yield response.data;
    } catch (error) {
      console.warn(`⚠️ Failed to fetch user ${id}:`, error);
    }
  }
}

const processUsersInBatches = async (
  userIds: number[],
  batchSize: number = 5
): Promise<User[]> => {
  const results: User[] = [];

  for (let i = 0; i < userIds.length; i += batchSize) {
    const batch = userIds.slice(i, i + batchSize);
    const promises = batch.map((id) =>
      new SynthwaveApiClient().fetchUser(id).then((res) => res.data)
    );

    try {
      const batchResults = await Promise.allSettled(promises);

      batchResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          console.error(`❌ Batch item ${batch[index]} failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error("🚨 Batch processing failed:", error);
    }
  }

  return results;
};

// ==========================================
// 🎯 DECORATORS & METADATA
// ==========================================

function logExecution(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const startTime = performance.now();
    console.log(`🚀 Executing ${propertyKey} with args:`, args);

    try {
      const result = await originalMethod.apply(this, args);
      const endTime = performance.now();
      console.log(`✅ ${propertyKey} completed in ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      console.error(`💥 ${propertyKey} failed:`, error);
      throw error;
    }
  };
}

function validateInput(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (args.some((arg) => arg === null)) {
      throw new Error(
        `❌ Invalid input for ${propertyKey}: null or undefined arguments`
      );
    }
    return originalMethod.apply(this, args);
  };
}

function debounce(delay: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let timeoutId: NodeJS.Timeout;
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => originalMethod.apply(this, args), delay);
    };
  };
}

// ==========================================
// 🌈 ADVANCED PATTERNS & UTILITIES
// ==========================================

class UserRepository {
  private cache = new Map<number, User>();

  async findById(id: number): Promise<User | null> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    // Fetch from API
    try {
      const client = new SynthwaveApiClient();
      const response = await client.fetchUser(id);
      this.cache.set(id, response.data);
      return response.data;
    } catch {
      return null;
    }
  }

  // Method chaining example
  filterBy(predicate: (user: User) => boolean): UserRepository {
    const filteredUsers = Array.from(this.cache.values()).filter(predicate);
    const newRepo = new UserRepository();
    filteredUsers.forEach((user) => newRepo.cache.set(user.id, user));
    return newRepo;
  }
}

// ==========================================
// 🔥 TEMPLATE LITERALS & TAGGED TEMPLATES
// ==========================================

const createApiUrl = (endpoint: string, version: number = 1): string =>
  `${API_BASE_URL}/v${version}${
    endpoint.startsWith("/") ? "" : "/"
  }${endpoint}`;

const html = (strings: TemplateStringsArray, ...values: any[]): string => {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? String(values[i]) : "";
    return result + string + value;
  }, "");
};

const userProfileHtml = (user: User) => html`
  <div class="user-profile" data-user-id="${user.id}">
    <h2 class="neon-glow">${user.name}</h2>
    <p class="contact">📧 ${user.email}</p>
    <span class="status ${user.isActive ? "active" : "inactive"}">
      ${user.isActive ? "🟢 Online" : "🔴 Offline"}
    </span>
  </div>
`;

// ==========================================
// 🎮 EXAMPLE USAGE & DEMO
// ==========================================

async function demonstrateTheme(): Promise<void> {
  console.log("🌈 SynthWave Dark Theme Showcase");
  console.log("=".repeat(50));

  // Create sample users
  const users: User[] = [
    createUser({ name: "Neo Anderson", email: "neo@matrix.dev" }),
    createUser({ name: "Trinity", email: "trinity@zion.net" }),
    createUser({ name: "Morpheus", email: "morpheus@redpill.org" }),
  ];

  // Array methods and functional programming
  const activeUsers = users
    .filter((user) => user.isActive)
    .map((user) => ({ ...user, displayName: formatUserName(user) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Object destructuring and spread
  const { length: userCount } = activeUsers;
  const [firstUser, ...restUsers] = activeUsers;

  // Template literals with expressions
  console.log(`Found ${userCount} active user${userCount !== 1 ? "s" : ""}`);
  console.log(`First user: ${firstUser?.displayName ?? "None"}`);

  // Regular expressions
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  const hexColorRegex = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g;

  // Switch statement with complex matching
  const getUserRole = (user: User): UserRole => {
    switch (true) {
      case user.email.includes("@admin."):
        return "admin";
      case user.email.includes("@mod."):
        return "moderator";
      default:
        return "user";
    }
  };

  // Error handling patterns
  try {
    const repository = new UserRepository();
    const foundUser = await repository.findById(users[0].id);

    if (foundUser) {
      console.log(`✨ Found user: ${foundUser.name}`);
      console.log(userProfileHtml(foundUser));
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`💥 Something went wrong: ${error.message}`);
    } else {
      console.error("💥 Unknown error occurred");
    }
  } finally {
    console.log("🎭 Demo completed");
  }

  // Number operations and computations
  const calculations = {
    total: users.length * 100,
    average: Math.round((users.length / 2) * 10) / 10,
    percentage: (activeUsers.length / users.length) * 100,
    binary: 0b1010101010,
    hex: 0xff92672,
    exponential: 1e6,
    float: 3.14159,
  };

  console.log("📊 Statistics:", calculations);
}

// ==========================================
// 🚀 EXPORT STATEMENTS
// ==========================================

export default SynthwaveApiClient;
export {
  User,
  UserRole,
  Status,
  NEON_COLORS,
  createUser,
  validateEmail,
  memoize,
  demonstrateTheme,
};

export type { ApiResponse, DeepPartial, EventMap, HttpMethod, ApiEndpoint };

// Module augmentation example
declare global {
  interface Window {
    synthwaveAPI: SynthwaveApiClient;
  }
}

// ==========================================
// 🎯 TYPE ASSERTIONS & GUARDS
// ==========================================

const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj
  );
};

const assertIsNumber = (value: unknown): asserts value is number => {
  if (typeof value !== "number") {
    throw new Error(`Expected number, got ${typeof value}`);
  }
};

// Final showcase execution
if (require.main === module) {
  demonstrateTheme().catch(console.error);
}
