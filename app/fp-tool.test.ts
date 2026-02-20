import { describe, it, expect } from "vitest";
import { get } from "./fp-tool";

describe("get", () => {
  it("returns value at single key path", () => {
    const obj = { a: 1, b: 2 };
    expect(get(obj, ["a"])).toBe(1);
    expect(get(obj, ["b"])).toBe(2);
  });

  it("returns nested value at multi-key path", () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, ["a"])).toEqual({ b: { c: 42 } });
    expect(get(obj, ["a", "b"])).toEqual({ c: 42 });
    expect(get(obj, ["a", "b", "c"])).toBe(42);
  });

  it("returns undefined when key does not exist", () => {
    const obj = { a: 1 };
    expect(get(obj, ["x"])).toBeUndefined();
    expect(get(obj, ["a", "x"])).toBeUndefined();
  });

  it("returns undefined when intermediate path is undefined", () => {
    const obj = { a: undefined as { b: number } | undefined };
    expect(get(obj, ["a", "b"])).toBeUndefined();
  });

  it("returns undefined when intermediate path is null", () => {
    const obj = { a: null as { b: number } | null };
    expect(get(obj, ["a", "b"])).toBeUndefined();
  });

  it("returns object itself when keys array is empty", () => {
    const obj = { a: 1, b: 2 };
    expect(get(obj, [])).toBe(obj);
  });

  it("handles array indices", () => {
    const obj = { items: [10, 20, 30] };
    expect(get(obj, ["items", 0])).toBe(10);
    expect(get(obj, ["items", 1])).toBe(20);
  });

  it("returns undefined for out-of-bounds array index", () => {
    const obj = { items: [10, 20] };
    expect(get(obj, ["items", 5])).toBeUndefined();
  });
});
