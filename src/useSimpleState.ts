import { useEffect, useState } from "react";
import { IObserved } from "./makeObservable";

const useSimpleState = (
  observable: IObserved,
  select: string,
  onChange?: (value: unknown) => void
) => {
  const [state, setState] = useState(observable[select]);
  useEffect(() => {
    const unobserve = observable.observe(select, onChange || setState);
    return unobserve;
  }, []);
  const setSimpleState = (value: unknown) => {
    observable[select] = value;
  };
  return [state, setSimpleState];
};

export default useSimpleState;
