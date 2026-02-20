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

// const 타입 파라미터로 배열 리터럴에서 튜플 추론 (as const 불필요, TS 5.0+)
export function get<T>(obj: T, keys: []): T;
export function get<
  T,
  const P extends readonly [string | number, ...(string | number)[]],
>(obj: T, keys: P): GetAtPath<T, P>;
export function get(obj: unknown, keys: readonly (string | number)[]): unknown {
  let result: unknown = obj;
  for (const key of keys) {
    result = (result as Record<string | number, unknown>)?.[key];
    if (result === undefined) break;
  }
  return result;
}

export const O = { get };
