import { useCallback, useEffect, useState } from 'react';
import { IObject, IObserved } from './make-observable';

type Callback<T> = (value: T) => T;

const useSimpleState = <T>(
  observable: IObserved<IObject>,
  select: string,
  onChange?: (value: T) => void,
): [state: T | undefined, setSimpleState: (value: Callback<T> | T) => void] => {
  const [state, setState] = useState<T | undefined>(
    onChange ? undefined : (observable[select] as T),
  );

  useEffect(() => {
    if (onChange) onChange(observable[select] as T);
    const unobserve = observable.observe(select, onChange || setState);
    return unobserve;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSimpleState = useCallback((props: Callback<T> | T) => {
    if (props instanceof Function) {
      observable[select] = props(observable[select] as T);
    } else {
      observable[select] = props;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, setSimpleState];
};

export default useSimpleState;
