import { useEffect, useState } from 'react';
import { IObserved } from './make-observable';

const useSimpleState = (
  observable: IObserved,
  select: string,
  onChange?: (value: unknown) => void,
): [state: unknown, setSimpleState: (value: unknown) => void] => {
  const [state, setState] = useState(observable[select]);

  useEffect(() => {
    const unobserve = observable.observe(select, onChange || setState);
    return unobserve;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSimpleState = (value: unknown) => {
    // eslint-disable-next-line no-param-reassign
    observable[select] = value;
  };

  return [state, setSimpleState];
};

export default useSimpleState;
