import { useCallback, useEffect, useState } from 'react';
import { IObject, IObserved } from './make-observable';

type Callback = (value: unknown) => unknown;

declare function SetSimpleState(selector: string, callback: Callback): void;
declare function SetSimpleState(selector: string, value: unknown): void;

type ReturnType<T> = [state: T, setSimpleState: typeof SetSimpleState];

const generateObject = <T>(
  observed: IObserved<IObject>,
  selectors: string[],
): T =>
  selectors.reduce((acc, curr) => {
    acc[curr] = observed[curr];
    return acc;
  }, {} as Record<string, unknown>) as T;

/**
 * @deprecated use `useSimpleState2` instead
 */
const useSimpleStateMulti = <T extends Record<string, unknown>>(
  observable: IObserved<IObject>,
  selectors: string[],
  onChange?: (selector: string, value: unknown) => void,
): ReturnType<T> => {
  const [state, setState] = useState(generateObject<T>(observable, selectors));

  useEffect(() => {
    const unobserve = observable.observe(selectors, (selector, value) => {
      if (onChange) onChange(selector, value);
      else setState((oldState) => ({ ...oldState, [selector]: value }));
    });
    return unobserve;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSimpleState: typeof SetSimpleState = useCallback(
    (selector, value) => {
      if (typeof value === 'function') {
        observable[selector] = value(observable[selector]);
      } else {
        observable[selector] = value;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return [state, setSimpleState];
};

export default useSimpleStateMulti;
