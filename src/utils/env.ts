import dotenv from "dotenv";

dotenv.config();

/**
 * The list of keys that were retrieved from the environment
 * @type {string[]}
 */
export const Keys: string[] = [];

/**
 * Retrieves an environment variable and parses it as string
 * @param {string} key - the name of the environment variable to retrieve
 * @param {string} fallback - the fallback value to use if the environment variable is not set or is invalid
 * @returns {string} - the value of the environment variable or fallback
 */
export function GetString(key: string, fallback: string): string {
  Keys.push(key);
  if (process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
}

/**
 * Retrieves an environment variable and parses it as an integer
 * @param {string} key - the name of the environment variable to retrieve
 * @param {number} fallback - the fallback value to use if the environment variable is not set or is invalid
 * @returns {number} - the value of the environment variable or fallback
 */
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

/**
 * Retrieves an environment variable and parses it as a boolean
 * @param {string} key - the name of the environment variable to retrieve
 * @param {boolean} fallback - the fallback value to use if the environment variable is not set or is invalid
 * @returns {boolean} - the value of the environment variable or fallback
 */
export function GetBool(key: string, fallback: boolean): boolean {
  Keys.push(key);
  if (process.env[key]) {
    const strValue = process.env[key]?.toLowerCase() || "";
    if (strValue === "true" || strValue === "1") {
      return true;
    } else if (strValue === "false" || strValue === "0") {
      return false;
    }
  }
  return fallback;
}
