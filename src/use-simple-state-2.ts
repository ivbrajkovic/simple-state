import { useCallback, useEffect, useState } from 'react';
import { Handler, Observable, OmitObservableFnc } from './make-observable-2';

import { KeyOrKeysOf } from './types';
import { filterObject, FilterObjectReturnType } from './utility';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValueElseIndexValue<K> = K extends any[] ? K[number] : K;

// eslint-disable-next-line @typescript-eslint/ban-types
type FunctionElseNever<T, U> = T extends Function ? never : U;
type FunctionElseUndefined<T, U> = FunctionElseNever<T, U> extends never
  ? undefined
  : U;

type SetSimpleState<T, K extends KeyOrKeysOf<T>> = (
  value:
    | Partial<Pick<T, ValueElseIndexValue<K>>>
    | ((
        value: FilterObjectReturnType<T, K>,
      ) => Partial<Pick<T, ValueElseIndexValue<K>>>),
) => void;

const useSimpleState = <
  T,
  K extends KeyOrKeysOf<OmitObservableFnc<T>>,
  U extends Handler<T, K> | undefined,
>(
  observable: T,
  select: K,
  onChange?: U,
  onUnmount?: (
    observable: FilterObjectReturnType<T, K>,
  ) => Partial<Pick<T, ValueElseIndexValue<K>>> | void,
): [
  state: FunctionElseUndefined<U, NonNullable<typeof state>>,
  setSimpleState: typeof setSimpleState,
] => {
  const [state, setState] = useState(() =>
    onChange ? undefined : filterObject(observable, select),
  );

  useEffect(() => {
    onChange?.(filterObject(observable, select));
    const unobserve = (observable as Observable<T, K>).observe(
      select,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onChange || ((changes) => setState((prev) => ({ ...prev!, ...changes }))),
    );
    return () => {
      unobserve?.();
      if (onUnmount) {
        const result = onUnmount(filterObject(observable, select));
        if (result) Object.assign(observable, result);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSimpleState: SetSimpleState<T, K> = useCallback(
    (value) => {
      if (value instanceof Function)
        Object.assign(observable, value(filterObject(observable, select)));
      else Object.assign(observable, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return [
    state as FunctionElseUndefined<U, NonNullable<typeof state>>,
    setSimpleState,
  ];
};

export default useSimpleState;
