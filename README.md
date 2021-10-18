# :zap: Simple reactive state

Simple usage, no configuration.

Simple state management that can be used for sharing reactive properties among component on deferent position and level in tree branch without need for context or providers.
Just import a hook and use it in every component you need and only this component will rerender on change.

Hook usage is similar to well known useState hook :wink:

---
### 🚀 [Demo](https://codesandbox.io/s/simple-state-q0bke) - Codesandbox basic example

## Basic usage

```js
import { makeObservable, useSimpleState } from "@ivbrajkovic/simple-state";

// This can be an object with many properties
const store = makeObservable({ clickCounter: 0 });

// Select property you want to observer
export const useSimpleStore = (select) => {
  return useSimpleState(store, select);
};
```

## TODO

1. Add multiple selector
2. Add reference equality check
