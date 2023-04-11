import dotenv from "dotenv";
import { GetInt, GetString, Keys } from "../env";

jest.mock("dotenv");
dotenv.config();

describe("config", () => {
  beforeEach(() => {
    jest.resetModules();
    Keys.length = 0;
  });

  describe("GetString", () => {
    it("should return the environment variable if it exists", () => {
      process.env.TEST_VAR = "test";
      const result = GetString("TEST_VAR", "fallback");
      expect(result).toEqual("test");
    });

    it("should return the fallback if the environment variable does not exist", () => {
      const result = GetString("MISSING_VAR", "fallback");
      expect(result).toEqual("fallback");
    });

    it("should add the key to Keys", () => {
      GetString("TEST_VAR", "fallback");
      expect(Keys).toContain("TEST_VAR");
    });
  });

  describe("GetInt", () => {
    it("should return the environment variable as an integer if it exists", () => {
      process.env.TEST_VAR = "42";
      const result = GetInt("TEST_VAR", 0);
      expect(result).toEqual(42);
    });

    it("should return the fallback if the environment variable does not exist", () => {
      const result = GetInt("MISSING_VAR", 42);
      expect(result).toEqual(42);
    });

    it("should return the fallback if the environment variable cannot be parsed as an integer", () => {
      process.env.TEST_VAR = "notanumber";
      const result = GetInt("TEST_VAR", 42);
      expect(result).toEqual(42);
    });

    it("should add the key to Keys", () => {
      GetInt("TEST_VAR", 0);
      expect(Keys).toContain("TEST_VAR");
    });
  });
});
