import { Dispatch, SetStateAction } from 'react';

type Selector =
  | string
  | string[]
  | ((selector: string, value: unknown) => void);

type CallbackOne<T> = ((value: T) => void) | undefined;
type CallbackTwo<T> = ((selector: string, value: T) => void) | undefined;

declare function Observe<T>(selector: string, callback: CallbackOne<T>): void;
declare function Observe<T>(
  selectors: string[],
  callback: CallbackTwo<T>,
): void;
declare function Observe<T>(callback: CallbackTwo<T>): void;
declare function Observe<T>(
  selector: string,
  callback: Dispatch<SetStateAction<T>>,
): void;

export type ObserveType = typeof Observe;

type HandlerCallback = (...properties: unknown[]) => void;
type Handler = [selector: Selector, callback?: HandlerCallback];

export type IObject = {
  [key: string]: unknown;
  [key: symbol]: Array<Handler>;
};

export type IObserved<T> = T & {
  observe: typeof Observe;
  unobserveAll: () => void;
  getObserversCount: () => number;
};

/**
 * @deprecated use `makeObservable2` instead
 */
const makeObservableSelect = <T extends IObject>(observed: T): IObserved<T> => {
  // 1. Initialize handlers array
  const handlers = Symbol('handlers');
  (observed as IObject)[handlers] = [];

  (observed as IObserved<T>).getObserversCount = function getObserversCount() {
    return observed[handlers].length;
  };

  (observed as IObserved<T>).unobserveAll = function unobserveAll() {
    observed[handlers].length = 0;
  };

  // Add handler to array
  (observed as IObserved<T>).observe = function observe(...handler: Handler) {
    // TODO Add handler reference equality check
    (observed as IObject)[handlers].push(handler);

    // Remove handler from the list
    return function unobserve() {
      (observed as IObject)[handlers] = observed[handlers].filter(
        (h) => h !== handler,
      );
    };
  } as typeof Observe;

  // 2. Create a proxy to handle changes
  return new Proxy(observed as IObserved<T>, {
    set(target, property, value, receiver) {
      const reflectValue = Reflect.get(target, property, receiver) as unknown;

      // TODO Check object equality on different level
      // TODO Add adjustable checking level (lv. 1, 2, 3, ...)

      // Update only if string and different
      if (typeof property === 'symbol' || value === reflectValue) return true;

      // Forward the operation to object
      const success = Reflect.set(target, property, value, receiver);

      if (success) {
        // Notify all subscribers
        target[handlers].forEach(([first, second]) => {
          if (typeof first === 'function') first(property, value);
          else if (first === property) second?.(value);
          else if (Array.isArray(first) && first.includes(property))
            second?.(property, value);
        });
      }

      // Throw error if false
      return success;
    },
  });
};

export default makeObservableSelect;
