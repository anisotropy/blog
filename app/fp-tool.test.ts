import { describe, test, expect } from "vitest";
import { get, pipe } from "./fp-tool";

describe("pipe", () => {
  test("1개 함수 파이프", () => {
    const addOne = (x: number) => x + 1;
    expect(pipe(1, addOne)).toBe(2);
  });
  describe("2개 함수 파이프", () => {
    test("두 함수를 연결하여 실행", () => {
      const addOne = (x: number) => x + 1;
      const multiplyByTwo = (x: number) => x * 2;
      const piped = pipe(5, addOne, multiplyByTwo);
      expect(piped).toBe(12); // (5 + 1) * 2 = 12
    });
    test("문자열 함수 연결", () => {
      const toUpperCase = (str: string) => str.toUpperCase();
      const addExclamation = (str: string) => str + "!";
      const piped = pipe("hello", toUpperCase, addExclamation);
      expect(piped).toBe("HELLO!");
    });
    test("타입 변환 함수 연결", () => {
      const toString = (num: number) => num.toString();
      const getLength = (str: string) => str.length;
      const piped = pipe(12345, toString, getLength);
      expect(piped).toBe(5);
    });
  });
  describe("3개 함수 파이프", () => {
    test("세 함수를 연결하여 실행", () => {
      const addOne = (x: number) => x + 1;
      const multiplyByTwo = (x: number) => x * 2;
      const subtractThree = (x: number) => x - 3;
      const piped = pipe(5, addOne, multiplyByTwo, subtractThree);
      expect(piped).toBe(9); // ((5 + 1) * 2) - 3 = 9
    });
    test("문자열 처리 체인", () => {
      const trim = (str: string) => str.trim();
      const toUpperCase = (str: string) => str.toUpperCase();
      const addPrefix = (str: string) => "PREFIX: " + str;
      const piped = pipe("  hello world  ", trim, toUpperCase, addPrefix);
      expect(piped).toBe("PREFIX: HELLO WORLD");
    });
  });
  describe("4개 함수 파이프", () => {
    test("네 함수를 연결하여 실행", () => {
      const addOne = (x: number) => x + 1;
      const multiplyByTwo = (x: number) => x * 2;
      const subtractThree = (x: number) => x - 3;
      const square = (x: number) => x * x;
      const piped = pipe(5, addOne, multiplyByTwo, subtractThree, square);
      expect(piped).toBe(81); // ((((5 + 1) * 2) - 3) ^ 2) = 81
    });
    test("복잡한 데이터 변환 체인", () => {
      const splitWords = (str: string) => str.split(" ");
      const filterLongWords = (words: string[]) =>
        words.filter((word) => word.length > 3);
      const toUpperCase = (words: string[]) =>
        words.map((word) => word.toUpperCase());
      const joinWithDash = (words: string[]) => words.join("-");
      const piped = pipe(
        "hello world this is a test",
        splitWords,
        filterLongWords,
        toUpperCase,
        joinWithDash
      );
      expect(piped).toBe("HELLO-WORLD-THIS-TEST");
    });
  });
  describe("5개 함수 파이프", () => {
    test("다섯 함수를 연결하여 실행", () => {
      const addOne = (x: number) => x + 1;
      const multiplyByTwo = (x: number) => x * 2;
      const subtractThree = (x: number) => x - 3;
      const square = (x: number) => x * x;
      const addTen = (x: number) => x + 10;
      const piped = pipe(
        5,
        addOne,
        multiplyByTwo,
        subtractThree,
        square,
        addTen
      );
      expect(piped).toBe(91); // (((((5 + 1) * 2) - 3) ^ 2) + 10) = 91
    });
    test("복잡한 객체 변환 체인", () => {
      const parseNumber = (str: string) => parseInt(str, 10);
      const addFive = (num: number) => num + 5;
      const multiplyByThree = (num: number) => num * 3;
      const createObject = (num: number) => ({ value: num, doubled: num * 2 });
      const stringify = (obj: object) => JSON.stringify(obj);
      const piped = pipe(
        "10",
        parseNumber,
        addFive,
        multiplyByThree,
        createObject,
        stringify
      );
      expect(piped).toBe('{"value":45,"doubled":90}');
    });
  });
  describe("에지 케이스", () => {
    test("null/undefined 처리", () => {
      const addOne = (x: number | null) => (x ?? 0) + 1;
      const multiplyByTwo = (x: number) => x * 2;
      expect(pipe(null, addOne, multiplyByTwo)).toBe(2);
      expect(pipe(5, addOne, multiplyByTwo)).toBe(12);
    });
  });
});

describe("get", () => {
  test("단일 키 경로의 값을 반환", () => {
    const obj = { a: 1, b: 2 };
    expect(get(obj, ["a"])).toBe(1);
    expect(get(obj, ["b"])).toBe(2);
  });

  test("다중 키 경로의 중첩 값을 반환", () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, ["a"])).toEqual({ b: { c: 42 } });
    expect(get(obj, ["a", "b"])).toEqual({ c: 42 });
    expect(get(obj, ["a", "b", "c"])).toBe(42);
  });

  test("키가 존재하지 않으면 undefined 반환", () => {
    const obj = { a: 1 };
    expect(get(obj, ["x"])).toBeUndefined();
    expect(get(obj, ["a", "x"])).toBeUndefined();
  });

  test("중간 경로가 undefined이면 undefined 반환", () => {
    const obj = { a: undefined as { b: number } | undefined };
    expect(get(obj, ["a", "b"])).toBeUndefined();
  });

  test("중간 경로가 null이면 undefined 반환", () => {
    const obj = { a: null as { b: number } | null };
    expect(get(obj, ["a", "b"])).toBeUndefined();
  });

  test("빈 keys 배열이면 객체 자체 반환", () => {
    const obj = { a: 1, b: 2 };
    expect(get(obj, [])).toBe(obj);
  });

  test("배열 인덱스 처리", () => {
    const obj = { items: [10, 20, 30] };
    expect(get(obj, ["items", 0])).toBe(10);
    expect(get(obj, ["items", 1])).toBe(20);
  });

  test("범위 밖 배열 인덱스는 undefined 반환", () => {
    const obj = { items: [10, 20] };
    expect(get(obj, ["items", 5])).toBeUndefined();
  });

  describe("커리 형태: get(keys)(obj)", () => {
    test("단일 키 경로의 값을 반환", () => {
      const obj = { a: 1, b: 2 };
      expect(get(["a"])(obj)).toBe(1);
      expect(get(["b"])(obj)).toBe(2);
    });

    test("다중 키 경로의 중첩 값을 반환", () => {
      const obj = { a: { b: { c: 42 } } };
      expect(get(["a"])(obj)).toEqual({ b: { c: 42 } });
      expect(get(["a", "b"])(obj)).toEqual({ c: 42 });
      expect(get(["a", "b", "c"])(obj)).toBe(42);
    });

    test("키가 존재하지 않으면 undefined 반환", () => {
      const obj = { a: 1 };
      expect(get(["x"])(obj)).toBeUndefined();
      expect(get(["a", "x"])(obj)).toBeUndefined();
    });

    test("배열 인덱스 처리", () => {
      const obj = { items: [10, 20, 30] };
      expect(get(["items", 0])(obj)).toBe(10);
      expect(get(["items", 1])(obj)).toBe(20);
    });

    test("2인자 형태와 동일한 결과 반환", () => {
      const obj = { x: { y: 100 } };
      expect(get(["x", "y"])(obj)).toBe(get(obj, ["x", "y"]));
    });
  });
});
