//
// pipe
// ---------

/** 함수를 합성한다. */
export function pipe<A, B>(p: A, fn1: (p: A) => B): B;
export function pipe<A, B, C>(p: A, fn1: (p: A) => B, fn2: (p: B) => C): C;
export function pipe<A, B, C, D>(
  p: A,
  fn1: (p: A) => B,
  fn2: (p: B) => C,
  fn3: (p: C) => D
): D;
export function pipe<A, B, C, D, E>(
  p: A,
  fn1: (p: A) => B,
  fn2: (p: B) => C,
  fn3: (p: C) => D,
  fn4: (p: D) => E
): E;
export function pipe<A, B, C, D, E, F>(
  p: A,
  fn1: (p: A) => B,
  fn2: (p: B) => C,
  fn3: (p: C) => D,
  fn4: (p: D) => E,
  fn5: (p: E) => F
): F;
/* eslint-disable @typescript-eslint/no-explicit-any */
export function pipe(param: any, ...fns: any[]): any {
  return fns.reduce((result, fn) => fn(result), param);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

//
// get
// --------

// T extends infer U ? ... : never 로 유니온 분배 → {a}|{b}에서 get(_, ['b']) = string | undefined
type GetAtPath<T, P extends readonly (string | number)[]> = T extends infer U
  ? P extends []
    ? U
    : P extends readonly [infer K0, ...infer Rest]
      ? Rest extends readonly (string | number)[]
        ? K0 extends keyof U
          ? GetAtPath<U[K0], Rest>
          : undefined
        : never
      : unknown
  : never;

/**
 * 주어진 객체(`obj`)의 특정 경로(`keys`)의 값을 가져온다.
 */
export function get<T>(obj: T, keys: []): T;
export function get<
  T,
  const P extends readonly [string | number, ...(string | number)[]],
>(obj: T, keys: P): GetAtPath<T, P>;
export function get<
  const P extends readonly [string | number, ...(string | number)[]],
>(keys: P): <T>(obj: T) => GetAtPath<T, P>;
/* eslint-disable @typescript-eslint/no-explicit-any */
export function get(...params: any[]) {
  function _get(obj: unknown, keys: readonly (string | number)[]): unknown {
    let result: unknown = obj;
    for (const key of keys) {
      result = (result as Record<string | number, unknown>)?.[key];
      if (result === undefined) break;
    }
    return result;
  }
  if (params.length === 1) return (obj: unknown) => _get(obj, params[0]);
  return _get(params[0], params[1]);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const O = { get };
