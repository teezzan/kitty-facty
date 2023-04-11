import dotenv from "dotenv";

dotenv.config();

// Keys is a list of keys that were retrieved from environment.
export const Keys: string[] = [];

// GetString retrieves an environment variable and parses it as string.
export function GetString(key: string, fallback: string): string {
  Keys.push(key);
  if (process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
}

// GetInt retrieves an environment variable and parses it as int.
export function GetInt(key: string, fallback: number): number {
  Keys.push(key);
  if (process.env[key]) {
    const i = parseInt(process.env[key] as string, 10);
    if (!isNaN(i)) {
      return i;
    }
  }
  return fallback;
}