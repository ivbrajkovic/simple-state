# :zap: Simple reactive state

### Ultra fast, ultra simple, zero configuration and zero dependency

Simple state management that can be used for sharing reactive properties among component on deferent position and level in tree branch without need for context or providers.
Just import a hook and use it in every component you need and only this component will rerender on change.

Hook usage is similar to well known useState hook :wink:

---
### 🚀 [Demo](https://codesandbox.io/s/simple-state-q0bke) - Codesandbox basic example

## Basic usage

Store module

```js
// store.js
import { makeObservable, useSimpleState } from "@ivbrajkovic/simple-state";

// This can be an object with many properties
const store = makeObservable({ clickCounter: 0 });

// Select property you want to observer
export const useSimpleStore = (select) => {
  return useSimpleState(store, select);
};
```

Some component

```js
// Component.js
import { useSimpeStore } from "./useSimpleStore";

const Component = () => {
  const [count, setCount] = useSimpeStore("clickCounter");
  
  return <div>
    <button onClick={() => setCount(count + 1)}>Incerment</button>
    <div>{count}</div>
  </div>
}

export default Component
```
<br /> 

## API

* `makeObservableSelect` - initialize observable object, accept object to observe and return observable
```js
const observable = makeObservableSelect(object);
```
| Param | Default | Required | Description | 
|---|---|---|---|
| object | { } | yes | object to observe |

| Returns | Description | 
|---|---|
| object | observable object |

<br />  

* `useSimpleState` - listen for change on observable
```js
const [state, setSimpleState] = useSimpleState(select, onChange?);
```
| Parame | Default | Required | Description |
|---|---|---|---|
| string | - | yes | property to oberve |

| Returns | Description | 
|---|---|
| state | observed value | 
| setSimpleState | update observed value |

<br /> 

## :checkered_flag: TODO

1. Add multiple selector
2. Add reference equality check
