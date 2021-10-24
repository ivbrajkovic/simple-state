import { useEffect, useState } from 'react';
import { IObserved } from './make-observable';

const generateObject = (observed: IObserved, selectors: string[]) => {
  const object: Record<string, unknown> = {};
  selectors.forEach((selector) => {
    object[selector] = observed[selector];
  });
  return object;
};

const useSimpleStateMulti = (
  observable: IObserved,
  selectors: string[],
  onChange?: (selector: string, value: unknown) => void,
): [
  state: Record<string, unknown>,
  setSimpleState: (selector: string, value: unknown) => void,
] => {
  const [state, setState] = useState(generateObject(observable, selectors));

  useEffect(() => {
    const unobserve = observable.observe(selectors, (selector, value) => {
      if (onChange) onChange(selector, value);
      else {
        setState((oldState) => ({ ...oldState, [selector]: value }));
      }
    });
    return unobserve;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSimpleState = (selector: string, value: unknown) => {
    // eslint-disable-next-line no-param-reassign
    observable[selector] = value;
  };
  return [state, setSimpleState];
};

export default useSimpleStateMulti;
