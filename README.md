# MobX decorators

_Several helper MobX decorators_

[![Build Status](https://img.shields.io/travis/farwayer/mobx-decorators.svg)](https://travis-ci.org/farwayer/mobx-decorators)
[![Coverage Status](https://img.shields.io/coveralls/farwayer/mobx-decorators.svg)](https://coveralls.io/github/farwayer/mobx-decorators?branch=master)

1. [Installation](https://github.com/farwayer/mobx-decorators#installation)
2. [Decorators](https://github.com/farwayer/mobx-decorators#decorators)
  * [@setter](https://github.com/farwayer/mobx-decorators#setter)
  * [@toggle](https://github.com/farwayer/mobx-decorators#toggle)
  * [@observe](https://github.com/farwayer/mobx-decorators#observe)
  * [@intercept](https://github.com/farwayer/mobx-decorators#intercept)
  * [@_interceptReads](https://github.com/farwayer/mobx-decorators#_interceptreads)
  * [@save](https://github.com/farwayer/mobx-decorators#save)
  * [@allObservable](https://github.com/farwayer/mobx-decorators#allobservable)
3. [Changelog](https://github.com/farwayer/mobx-decorators#changelog)


## Installation

```bash
npm install --save mobx-decorators
```

You also should use some transpiler (like babel).

```bash
npm install --save-dev babel-plugin-transform-decorators-legacy
```


## Decorators

### @setter

```js
@setter
@setter(name)
@setter(name, constValue)
@setter(transformFn: value =>)
@setter(name, transformFn: value =>)
```

Create setter for `property` with `setProperty` or custom name.

If `constValue` provided this value will be set every time setter called.
You can also provide transform function.

With `transformFn` function you can change value that will be set.    

```js
import {observable} from 'mobx'
import {setter} from 'mobx-decorators'
```

```js
class User {
  @setter
  @observable
  loggedIn = false;
}

const user = new User();
user.setLoggedIn(true); // user.loggedIn = true
```

```js
class User {
  @setter('updateLoggedIn')
  @observable
  loggedIn = false;
}

const user = new User();
user.updateLoggedIn(true); // user.loggedIn = true
```

```js
class User {
  @setter('login', true)
  @setter('logout', false)
  @observable
  loggedIn = false;
}

const user = new User();
user.login(); // user.loggedIn = true
user.logout(); // user.loggedIn = false
```

```js
class User {
  @setter(value => value && value.toUpperCase())
  @observable
  name;
}

const user = new User();
user.setName('Alice'); // user.name = 'ALICE'
```


### @toggle

```js
@toggle
@toggle(name)
```

Toggle boolean property (`property = !property`).

```js
import {observable} from 'mobx'
import {toggle} from 'mobx-decorators'
```

```js
class User {
  @toggle
  @observable
  loggedIn = false;
}

const user = new User();
user.toggleLoggedIn(); // user.loggedIn = !user.loggedIn
```

```js
class User {
  @toggle('swapLoggedIn')
  @observable
  loggedIn = false;
}

const user = new User();
user.swapLoggedIn(); // user.loggedIn = !user.loggedIn
```


### @observe

```js
@observe(onChanged: change =>)
@observe(onChanged: change =>, invokeBeforeFirstAccess)
```

`onChanged` will be called *after* property change.

If `invokeBeforeFirstAccess` is `true` handler will be called one time before
property first access (set or get).

More info can be found in
[mobx docs](https://mobxjs.github.io/mobx/refguide/observe.html)

```js
import {observable} from 'mobx'
import {observe} from 'mobx-decorators'
```

```js
class User {
  @observe(change => console.log(change.newValue))
  @setter
  @observable
  loggedIn = false;
}

const user = new User();
user.setLoggedIn(true); // console.log(true)
```

```js
class User {
  @observe(change => console.log(change.newValue), true)
  @setter
  @observable
  loggedIn = false;
}

const user1 = new User();
const loggedIn = user.loggedIn; // console.log(false)
user1.setLoggedIn(true); // console.log(true)

const user2 = new User();
user2.setLoggedIn(true); // console.log(false)
                         // console.log(true)
```


### @intercept

```js
@intercept(onWillChange: change =>)
```

`onWillChange` will be called *before* property change.
You can replace value or cancel change in handler.

More info can be found in
[mobx docs](https://mobxjs.github.io/mobx/refguide/observe.html)

```js
import {observable} from 'mobx'
import {intercept} from 'mobx-decorators'
```

```js
class User {
  @intercept(change => {
    change.newValue = 999;
    return change;
  })
  @setter
  @observable
  loginCount = 0;
}

const user = new User();
user.setLoginCount(1); // user.loginCount = 999;
```

```js
class User {
  @intercept(change => null)
  @setter
  @observable
  loginCount = 0;
}

const user = new User();
user.setLoginCount(1); // user.loginCount = 0;
```


### @_interceptReads

```js
@_interceptReads(onRead: value =>)
```

**interceptReads renamed in Mobx4 and look like will be deprecated**

`onRead` will be called *before* property reading.
You can transform value in handler.

More info can be found in
[mobx CHANGELOG](https://github.com/mobxjs/mobx/blob/master/CHANGELOG.md#3112-unpublished-wasnt-being-bundled-correctly-by-all-bundlers)

```js
import {observable} from 'mobx'
import {interceptReads} from 'mobx-decorators'
```

```js
class User {
  @interceptReads(value => value && value.toUpperCase())
  @observable
  name = 'Alice';
}

const user = new User();
console.log(user.name) // ALICE
```


### @save

```js
@save
@save({
  storage = defaultStorage(),
  storeName = store => store.storeName,
  serializer = {
    save: value => JSON.stringify(value),
    load: data => JSON.parse(data),
  },
  onLoaded = (store, property, value) => {},
  onSaved = (store, property, value) => {},
  onInitialized = (store, property, value) => {},
})
createSaveDecorator(baseOptions={})
```

**(!) TypeScript: you can't use class property initializers (`class F {prop = 1}`) with @save decorator**

`@save` decorator helps save and load observable value to/from permanent
storage. Keep in mind `@save` is *lazy* decorator and loading will be started
only after first property access. If you change property before or during
loading than restored value will be ignored.

`onLoaded` callback will be called only if value is loaded from storage.  
`onSave` will be called after saving.  
`onInitialized` will be called after loading attempt independent of the result.

By default values saved as `json`. In some cases (`Date` for example) you should
provide `serializer` (see example with date).

You must define `storeName` property in store (see examples) or pass it as
option. `storeName` option can be string or function.

Default storage is `localStorage` for browser, `AsyncStorage`
for React Native and memory for other platforms. You can specify you own
([localForage](https://github.com/localForage/localForage) for example)
by `storage` option. Storage must realize simple interface
(functions are async or return Promise):

```js
const MyStorage = {
  async getItem(key) {
    // return item
  },
  async setItem(key, value) {
    // save item
  }
}
```

If you need to pass the same options (storage for example) to `@save` decorator
of several properties than you can use `createSaveDecorator` function. 

```js
import {observable} from 'mobx'
import {save, createSaveDecorator} from 'mobx-decorators'
```

```js
class User {
  storeName = 'user';

  @save
  @observable
  loginCount;
}

const user = new User();
console.log(user.loginCount); // undefined
// @save will try to load loginCount from storage but
// loading is async (!) so value is still undefined here
```

```js
class User {
  storeName = 'user';

  // storage contains 999 for loginCount property
  @save({
    onInitialized: (store, property, value) => {
      console.log(property, value); // 'loginCount', 999
      console.log(store.loginCount); // 999
    },
    onLoaded: (store, property, value) => {
      console.log(property, value); // 'loginCount', 999
      console.log(store.loginCount); // 999
    },
    onSave: (store, property, value) => {
      console.log(property, value); // 1000
    }
  })
  @setter
  @observable
  loginCount;
}

const user = new User();
console.log(user.loginCount); // undefined, loading loginCount

// throw some time
console.log(user.loginCount); // 999

user.setLoginCount(1000); // 1000 will be saved to storage
```

```js
class User {
  @save({
    storeName: 'user',
  })
  @observable
  loginCount;
  
  @save({
    storeName: 'group',
  })
  @observable
  group;
}

const user = new User();
console.log(user.loginCount); // undefined, loading loginCount
console.log(user.group); // undefined, loading group
```

```js
class User {
  storeName = 'user';

  @save({
    serializer: {
      load: data => new Date(fromBSON(data)),
      save: value => toBSON(value),
    },
  })
  @observable
  lastLogin;
}

const user = new User();
console.log(user.lastLogin);
```

```js
const mysave = createSaveDecorator({
  storage: MyOwnStorage,
  storeName: store => store.constructor.name,
});

class User {
  @mysave
  @observable
  loginCount;
  
  @save
  @observable
  name;
}

const user = new User();
console.log(user.loginCount);
```

```js
const mysave = createSaveDecorator({
  storage: MyOwnStorage,
  storeName: 'user',
});

class User {
  @mysave({
    onInitialized: () => console.log('initialized')
  })
  @observable
  loginCount;
  
  @save
  @observable
  name;
}

const user = new User();
console.log(user.loginCount);
```


### @allObservable

```js
@allObservable
@allObservable({
  only,
  except = [],
})
```

Class decorator that makes all properties observable. Use `only` for
whitelisting properties and `except` for blacklisting.  

```js
import {allObservable} from 'mobx-decorators'
```

```js
@allObservable
class User {
  name = 'unknown';
  loginCount = 0;
}
```

```js
@allObservable({only: ['loginCount']})
class User {
  name = 'unknown';
  loginCount = 0;
}
```

```js
@allObservable({except: ['name']})
class User {
  name = 'unknown';
  loginCount = 0;
}
```


## Changelog

### 4.0.0

- major version is the same as MobX
- TypeScript support. Yippee!
- `@interceptReads` renamed to `@_interceptReads` (as in MobX4)
- `@setter` and `@toggle` auto bound to store
- `@save`: `transform` replaced with `serializer`
- `@save`: `storeName` option can be function
- all internal mobx kitchen depends removed

### 2.3.3

- prevent webpack to use non-transpiled source by default

### 2.3.2

- fix missed files in `lib`

### 2.3.0

- `@interceptReads`
- add missed `allObservable` export to react-native

### 2.2.4

- all callbacks called in store context now

### 2.2.3

- fix `@observe`, `@intercept` and `@save` may not work with extending

### 2.2.1

- `@allObservable`: fix getter and setter for observable was not defined

### 2.2.0

- `@allObservable`
- `@save`, `@observe` and `@intercept` can be defined after `@observable` now
- decorators return configurable properties now


### 2.1.1

- transpiling with es2015 preset now


### 2.1.0

- `@setter`: you can provide transform function now

```js
class User {
  @setter(value => value && value.toUpperCase())
  @observable
  name;
}

const user = new User();
user.setName('Alice'); // user.name = 'ALICE'
```

- `@save`, `@createSaveDecorator`
- transpiled version


### 2.0.0

- Adopting to mobx3

`@observe` callback receive change argument now (
[more info](https://github.com/mobxjs/mobx/blob/master/CHANGELOG.md#other-changes)
)
