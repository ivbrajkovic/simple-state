// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
export type KeyOf<T> = keyof T;
export type KeyOrKeysOf<T> = KeyOf<T> | KeyOf<T>[];

export type IsArray<T> = T extends any[] ? T : never;
export type IsNotArray<T> = T extends any[] ? never : T;

export type Optional<T> = {
  [P in keyof T]?: T[P];
};

export type OptionalIfArray<T, K> = K extends any[] ? Optional<T> : T;
