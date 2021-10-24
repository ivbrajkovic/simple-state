type Selector =
  | string
  | string[]
  | ((selector: string, value: unknown) => void);

type CallbackOne = ((value: unknown) => void) | undefined;
type CallbackTwo = ((selector: string, value: unknown) => void) | undefined;

declare function Observe(selector: string, callback: CallbackOne): void;
declare function Observe(selectors: string[], callback: CallbackTwo): void;
declare function Observe(callback: CallbackTwo): void;

type HandlerCallback = (...properties: unknown[]) => void;
type Handler = [selector: Selector, callback?: HandlerCallback];

export interface IObject {
  [key: string]: unknown;
  [key: symbol]: Array<Handler>;
}

export type IObserved = IObject & {
  observe: typeof Observe;
  unobserveAll: () => void;
  getObserversCount: () => number;
};

/* eslint-disable no-param-reassign */
const makeObservableSelect = (observed: IObject = {}): IObserved => {
  // 1. Initialize handlers array
  const handlers = Symbol('handlers');
  observed[handlers] = [];

  observed.getObserversCount = function getObserversCount() {
    return observed[handlers].length;
  };

  observed.unobserveAll = function unobserveAll() {
    observed[handlers].length = 0;
  };

  // Add handler to array
  observed.observe = function ObserveType(...handler: Handler) {
    // TODO Add handler reference equality check
    this[handlers].push(handler);

    // Remove handler from the list
    return function unobserve() {
      observed[handlers] = observed[handlers].filter((h) => h !== handler);
    };
  };

  // 2. Create a proxy to handle changes
  return new Proxy(observed as IObserved, {
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
          if (first instanceof Function) first(property, value);
          else if (first === property) second?.(value);
          else if (first.includes?.(property)) second?.(property, value);
        });
      }

      // Throw error if false
      return success;
    },
  });
};

export default makeObservableSelect;
/* eslint-enable no-param-reassign */
