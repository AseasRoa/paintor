---
title: Observe States
---

# Observe States

## Create Observers

State changes can be observed by using `on()`. It accepts either a state or
a state property. Here is an example of correctly using `on()` with a state:

```javascript
import { on, state } from 'paintor'

const personState = state({ name: 'John', age: 33 })

on(personState).change(...)     // Correct: The input is a state
on(personState.age).change(...) // Correct: The input is a state property
```

It doesn't work with values that are not involved in a state:

```javascript
import { on } from 'paintor'

const personObject = { name: 'Jane', age: 28 }

on(personState).change(...)     // Incorrect: The input is not a state
on(personState.age).change(...) // Incorrect: The input is not a state property
```

`on()` exposes the following functions:

- `.create()` - detects when new elements are created
- `.change()` - detects when existing elements are changed
- `.delete()` - detects when existing elements are deleted
- `.set()` - detects when new elements are created
  or existing elements are changed

Each of these functions has one argument - a listener function with one
argument, which is the event. The event is an object with the following
properties:

- key - the key in the state that was created, changed or deleted
- value - the current value
- oldValue - the previous value
- state - the state object
- target - the object, used to build the state

### .create()

`.create()` with object state:

```javascript
import { on, state } from 'paintor'

const personState = state({ name: 'John' })

on(personState).create((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: 'age',
   *    value: 33,
   *    oldValue: undefined,
   *    state: { name: 'John', age: 33 },
   *    target: { name: 'John', age: 33 }
   * }
   */
})

personState.age = 33
```

`.create()` with object state property:

```javascript
import { on, state } from 'paintor'

const personState = state({ name: 'John' })

on(personState.age).create((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: 'age',
   *    value: 33,
   *    oldValue: undefined,
   *    state: { name: 'John', age: 33 },
   *    target: { name: 'John', age: 33 }
   * }
   */
})

personState.age = 33
```

`.create()` with array state:

```javascript
import { on, state } from 'paintor'

const personState = state([ 'John' ])

on(personState).create((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: '1',
   *    value: 33,
   *    oldValue: undefined,
   *    state: [ 'John', 33 ],
   *    target: [ 'John', 33 ]
   * }
   */
})

personState.push(33)
```

`.create()` with array state property:

```javascript
import { on, state } from 'paintor'

const personState = state([ 'John' ])

on(personState[1]).create((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: '1',
   *    value: 33,
   *    oldValue: undefined,
   *    state: [ 'John', 33 ],
   *    target: [ 'John', 33 ]
   * }
   */
})

personState.push(33)
```

### .change()

`.change()` with object state:

```javascript
import { on, state } from 'paintor'

const personState = state({ name: 'John', age: 33 })

on(personState).change((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: 'age',
   *    value: 34,
   *    oldValue: 33,
   *    state: { name: 'John', age: 34 },
   *    target: { name: 'John', age: 34 }
   * }
   */
})

personState.age += 1
```

`.change()` with object state property:

```javascript
import { on, state } from 'paintor'

const personState = state({ name: 'John', age: 33 })

on(personState.age).change((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: 'age',
   *    value: 34,
   *    oldValue: 33,
   *    state: { name: 'John', age: 34 },
   *    target: { name: 'John', age: 34 }
   * }
   */
})

personState.age += 1
```

`.change()` with array state:

```javascript
import { on, state } from 'paintor'

const personState = state([ 'John', 33 ])

on(personState).change((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: '1',
   *    value: 34,
   *    oldValue: 33,
   *    state: [ 'John', 34 ],
   *    target: [ 'John', 34 ]
   * }
   */
})

personState[1] += 1
```

`.change()` with array state property:

```javascript
import { on, state } from 'paintor'

const personState = state([ 'John', 33 ])

on(personState[1]).change((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: '1',
   *    value: 34,
   *    oldValue: 33,
   *    state: [ 'John', 34 ],
   *    target: [ 'John', 34 ]
   * }
   */
})

personState[1] += 1
```

### .delete()

`.delete()` with object state:

```javascript
import { on, state } from 'paintor'

const personState = state({ name: 'John', age: 33 })

on(personState).delete((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: 'age',
   *    value: undefined,
   *    oldValue: 33,
   *    state: { name: 'John' },
   *    target: { name: 'John' }
   * }
   */
})

delete personState.age
```

`.delete()` with object state property:

```javascript
import { on, state } from 'paintor'

const personState = state({ name: 'John', age: 33 })

on(personState.age).delete((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: 'age',
   *    value: undefined,
   *    oldValue: 33,
   *    state: { name: 'John' },
   *    target: { name: 'John' }
   * }
   */
})

delete personState.age
```

`.delete()` with array state:

```javascript
import { on, state } from 'paintor'

const personState = state([ 'John', 33 ])

on(personState).delete((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: '1',
   *    value: undefined,
   *    oldValue: 33,
   *    state: [ 'John' ],
   *    target: [ 'John', empty ]
   * }
   */
})

delete personState[1]
// After delete, the length of the array remains the same
// and element 1 is empty
```

`.delete()` with array state property:

```javascript
import { on, state } from 'paintor'

const personState = state([ 'John', 33 ])

on(personState[1]).delete((event) => {
  console.log(event)

  /*
   * event is an object, containing this data:
   *
   * {
   *    key: '1',
   *    value: undefined,
   *    oldValue: 33,
   *    state: [ 'John' ],
   *    target: [ 'John', empty ]
   * }
   */
})

delete personState[1]
// After delete, the length of the array remains the same
// and element 1 is empty
```

### .set()

`.set()` is like a combination of `.create()` and `.change()`.

## Remove observers

`.off()` is used to remove observers. It has three arguments:

- state or state property
- (optional) the event to be removed - `'create'`, `'change'`, `'delete'` or `'set'`
- (optional) listener function

```javascript
import { on, off, state } from 'paintor'

const personState = state({ name: 'John', age: 33 })

// Observe
const statelistener = (event) => {...}
const nameListener = (event) => {...}
const ageListener = (event) => {...}

on(personState).change(statelistener)
on(personState.name).change(nameListener)
on(personState.age).change(ageListener)

// Remove all observers on personState
off(personState)

// Remove all observers on the 'name' property of personState
off(personState.name)

// Remove all 'change' observers on personState
off(personState, 'change')

// Remove the 'change' observer on personState,
// where 'nameListener' is used as a listener
off(personState, 'change', nameListener)

// Remove the 'change' observer on the 'age' property of personState,
// where 'ageListener' is used
off(personState.age, 'change', listenerTwo)
```
