import { KeyOrKeysOf, KeyOf } from './types';

export type HandlerProps<T, K> = K extends KeyOf<T>[]
  ? { [k in K[number]]?: T[k] }
  : K extends KeyOf<T>
  ? { [k in K]: T[K] } // ? T[K]
  : never;

export type Handler<T, K> = (props: HandlerProps<T, K>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Observed = Record<string, any>;

export type ObservableFnc<T = object, K = string> = {
  observe: <KK extends K>(key: KK, handler: Handler<T, KK>) => () => void;
  unobserveAll: () => void;
  handlerCount: () => number;
};

export type Observable<T, K extends KeyOrKeysOf<T>> = T &
  ObservableFnc<T, K> & {
    [handlers: symbol]: {
      [k in keyof T]?: Handler<T, K>[];
    };
  };

export type OmitObservableFnc<T> = Omit<T, keyof ObservableFnc>;

function makeObservable<T extends Observed, K extends KeyOrKeysOf<T>>(
  observed: T,
) {
  const HANDLERS = Symbol('handlers');

  const observable: Observable<T, K> = {
    ...observed,

    [HANDLERS]: {},

    // Add hew handler for keys on observed object
    observe<KK extends K>(
      this: Observable<T, KK>,
      key: KK,
      handler: Handler<T, KK>,
    ) {
      const keys = (Array.isArray(key) ? key : [key]) as KeyOf<T>[];

      // eslint-disable-next-line @typescript-eslint/no-shadow
      keys.forEach((key) => {
        if (!this[HANDLERS][key]) this[HANDLERS][key] = [handler];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        else this[HANDLERS][key]!.push(handler);
      });

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        keys.forEach((key) => {
          if (!this[HANDLERS][key]) return;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this[HANDLERS][key] = this[HANDLERS][key]!.filter(
            (h) => h !== handler,
          );
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (this[HANDLERS][key]!.length === 0) delete this[HANDLERS][key];
        });
      };
    },

    // Remove handler from mapped object
    unobserveAll() {
      Object.keys(this[HANDLERS]).forEach((key) => delete this[HANDLERS][key]);
    },

    // Count handlers in mapped object
    handlerCount() {
      let n = 0;
      Object.keys(this[HANDLERS]).forEach((key) => {
        n += this[HANDLERS][key]?.length ?? 0;
      });
      return n;
    },
  };

  // Lock observable properties
  Object.defineProperties(observable, {
    observe: {
      configurable: false,
      writable: false,
    },
    unobserveAll: {
      configurable: false,
      writable: false,
    },
    observersCount: {
      configurable: false,
      writable: false,
    },
  });

  // Create observable with setter trap
  return new Proxy(observable, {
    set(target, property, value, receiver) {
      // Property must be of type string
      if (typeof property !== 'string') return false;

      // Get property from observed object (target)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const reflectValue = Reflect.get(target, property, receiver);

      // Do not update property if old and new value are equal
      // Referential equality
      if (value === reflectValue) return true;

      // Update property
      const success = Reflect.set(target, property, value, receiver);
      if (!success) return false;

      // Call target observers
      target[HANDLERS][property]?.forEach((handler) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        handler({ [property]: value } as HandlerProps<T, K>);
      });

      return true;
    },
  });
}

export default makeObservable;
