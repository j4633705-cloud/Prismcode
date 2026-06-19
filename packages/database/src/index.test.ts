import { describe, expect, test } from "bun:test";

describe("database package", () => {
  test("exports are defined", () => {
    const db = require("./index");
    expect(db).toBeDefined();
  });
});
