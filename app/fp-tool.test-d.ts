import { test, expectTypeOf } from "vitest";
import { get } from "./fp-tool";

test("단일 키 경로: T['a']", () => {
  const obj = { a: 1, b: "x" };
  expectTypeOf(get(obj, ["a"])).toEqualTypeOf<number>();
  expectTypeOf(get(obj, ["b"])).toEqualTypeOf<string>();
});

test("중첩 경로: T['a']['b']['c']", () => {
  const obj = { a: { b: { c: 42 } } };
  expectTypeOf(get(obj, ["a"])).toEqualTypeOf<{ b: { c: number } }>();
  expectTypeOf(get(obj, ["a", "b"])).toEqualTypeOf<{ c: number }>();
  expectTypeOf(get(obj, ["a", "b", "c"])).toEqualTypeOf<number>();
});

test("빈 경로: 객체 자체 반환", () => {
  const obj = { a: 1, b: 2 };
  expectTypeOf(get(obj, [])).toEqualTypeOf<{ a: number; b: number }>();
});

test("존재하지 않는 키: undefined", () => {
  const obj = { a: 1 };
  expectTypeOf(get(obj, ["x"])).toEqualTypeOf<undefined>();
  expectTypeOf(get(obj, ["a", "x"])).toEqualTypeOf<undefined>();
});

test("배열 인덱스: number 키 지원", () => {
  const obj = { items: [10, 20, 30] };
  expectTypeOf(get(obj, ["items", 0])).toEqualTypeOf<number>();
  expectTypeOf(get(obj, ["items", 1])).toEqualTypeOf<number>();
  expectTypeOf(get({ items: [10, 20, 30] }, ["items"])).toEqualTypeOf<
    number[]
  >();
});

test("undefined/null 중간 경로: 유니온 분배로 number | undefined", () => {
  const objWithUndefined = { a: undefined as { b: number } | undefined };
  expectTypeOf(get(objWithUndefined, ["a", "b"])).toEqualTypeOf<
    number | undefined
  >();

  const objWithNull = { a: null as { b: number } | null };
  expectTypeOf(get(objWithNull, ["a", "b"])).toEqualTypeOf<
    number | undefined
  >();
});

test("서로 다른 키를 가진 유니온: 각 멤버별로 분배하여 string | undefined", () => {
  const unionWithDifferentKeys = {} as { a: string } | { b: string };
  expectTypeOf(get(unionWithDifferentKeys, ["a"])).toEqualTypeOf<
    string | undefined
  >();
  expectTypeOf(get(unionWithDifferentKeys, ["b"])).toEqualTypeOf<
    string | undefined
  >();
});

test("커리된 get: 단일 키", () => {
  const getA = get(["a"]);
  const obj = { a: 1, b: "x" };
  expectTypeOf(getA(obj)).toEqualTypeOf<number>();

  const getB = get(["b"]);
  expectTypeOf(getB(obj)).toEqualTypeOf<string>();
});

test("커리된 get: 중첩 경로", () => {
  const getABC = get(["a", "b", "c"]);
  const obj = { a: { b: { c: 42 } } };
  expectTypeOf(getABC(obj)).toEqualTypeOf<number>();

  const getAB = get(["a", "b"]);
  expectTypeOf(getAB(obj)).toEqualTypeOf<{ c: number }>();
});

test("커리된 get: 배열 인덱스", () => {
  const getFirst = get(["items", 0]);
  const obj = { items: [10, 20, 30] };
  expectTypeOf(getFirst(obj)).toEqualTypeOf<number>();
});

test("커리된 get: 존재하지 않는 키 → undefined", () => {
  const getX = get(["x"]);
  const obj = { a: 1 };
  expectTypeOf(getX(obj)).toEqualTypeOf<undefined>();
});
