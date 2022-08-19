export type FilterObjectReturnType<T, K> = K extends (keyof T)[]
  ? { [k in K[number]]: T[k] }
  : K extends keyof T
  ? { [k in K]: T[K] }
  : never;

export const filterObject = <T, K extends keyof T | (keyof T)[]>(
  object: T,
  key: K,
) => {
  const keys = (Array.isArray(key) ? key : [key]) as (keyof T)[];
  return keys.reduce((acc, curr) => {
    acc[curr] = object[curr];
    return acc;
  }, {} as Partial<T>) as FilterObjectReturnType<T, K>;
};
