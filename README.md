# MobX decorators

_Several helper MobX decorators_

[![Build Status](https://travis-ci.org/farwayer/mobx-decorators.svg?branch=master)](https://travis-ci.org/farwayer/mobx-decorators)
[![Coverage Status](https://coveralls.io/repos/github/farwayer/mobx-decorators/badge.svg?branch=master)](https://coveralls.io/github/farwayer/mobx-decorators?branch=master)

1. [Installation](https://github.com/farwayer/mobx-decorators#installation)
2. [Decorators](https://github.com/farwayer/mobx-decorators#decorators)
  * [@setter](https://github.com/farwayer/mobx-decorators#setter)
  * [@toggle](https://github.com/farwayer/mobx-decorators#toggle)
  * [@observe](https://github.com/farwayer/mobx-decorators#observe)
  * [@intercept](https://github.com/farwayer/mobx-decorators#intercept)
  * [@save](https://github.com/farwayer/mobx-decorators#save)
3. [Changelog](https://github.com/farwayer/mobx-decorators#changelog)


## Installation

```bash
npm install --save mobx-decorators
```

You also should use some transpiler (like babel).

```bash
npm install --save-dev babel-preset-es2015 \
  babel-plugin-transform-decorators-legacy \
  babel-plugin-transform-class-properties
```

**`transform-decorators-legacy` must be defined before
`transform-class-properties` in babel config.**


## Decorators

### @setter

*@setter*  
*@setter(name)*  
*@setter(name, constValue)*  
*@setter(transformFn: value =>)*  
*@setter(name, transformFn: value =>)*  

Create setter for `property` with `setProperty` or custom name.

If `constValue` provided this value will be set every time setter called.
You can also provide transform function.

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

*@toggle*  
*@toggle(name)*

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

*@observe(onChange: change =>)*  
*@observe(onChange: change =>, invokeBeforeFirstAccess)*

**Must be defined before @observable**

`onChange` will be called after property change.

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

*@intercept(onWillChange: change =>)*  

**Must be defined before @observable**

`onWillChange` will be called before property change.
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

### @save

*@save*  
*@save({  
&nbsp;&nbsp;storage = defaultStorage(),  
&nbsp;&nbsp;storeName = store.storeName,  
&nbsp;&nbsp;transform = item => item,  
&nbsp;&nbsp;onLoaded = (store, property, value) => {},  
&nbsp;&nbsp;onSaved = (store, property, value) => {},  
&nbsp;&nbsp;onInitialized = (store, property, value) => {},  
})*  
*createSaveDecorator(baseOptions={})

**Must be defined before @observable**

`@save` decorator helps save and load observable value to/from permanent
storage. Keep in mind `@save` is *lazy* decorator and loading will be started
only after first property access. If you change property before value will be
loaded than restored value will be ignored.

`onLoaded` callback will be called only if value is loaded from storage.  
`onSave` will be called after saving.  
`onInitialized` will be called after loading attempt independent of the result.

Because values saved as `json` in some cases (`Date` for example) you should
provide `transform` function (see example with date).

You must define `storeName` property in store (see examples) or pass it as
option.

Default storage is `localStorage` for browser, `AsyncStorage`
for React Native and memory for other platforms. You can specify you own
([localForage](https://github.com/localForage/localForage) for example)
by `storage` option. Storage must realize simple interface
(functions are async or must return Promise):

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

If you need to pass the same options (storage for example) to `@save` decorator of
several properties than you can use `createSaveDecorator` function. 

```js
import {observable} from 'mobx'
import {save, createSaveDecorator} from 'mobx-decorators'
```

```js
class User {
  storeName = 'user';

  @save
  @observable
  loginCount = 0;
}

const user = new User();
console.log(user.loginCount); // 0
// @save will try to load loginCount from storage but
// loading is async (!) so value is still 0 here
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
  loginCount = 0;
}

const user = new User();
console.log(user.loginCount); // 0

// after some time
console.log(user.loginCount); // 999

// after some time
user.setLoginCount(1000); // 1000 will be saved to storage
```

```js
class User {
  @save({
    storeName: 'user',
  })
  @observable
  loginCount = 0;
  
  @save({
    storeName: 'group',
  })
  @observable
  group = 'noname';
}

const user = new User();
console.log(user.loginCount); // 0
console.log(user.group); // 'noname'
```

```js
class User {
  storeName = 'user';

  @save({
    transform: value => {
      console.log(value); // "2017-03-15T19:20:24.638Z"
      return new Date(value)
    },
  })
  @observable
  lastLogin = new Date(2000, 1, 1);
}

const user = new User();
console.log(user.lastLogin);
```

```js
const save = createSaveDecorator({
  storage: MyOwnStorage,
  storeName: 'user',
});

class User {
  @save
  @observable
  loginCount = 0;
  
  @save
  @observable
  name = 'noname';
}

const user = new User();
console.log(user.loginCount);
```

```js
const save = createSaveDecorator({
  storage: MyOwnStorage,
  storeName: 'user',
});

class User {
  @save({
    onInitialized: () => console.log('initialized')
  })
  @observable
  loginCount = 0;
  
  @save
  @observable
  name = 'noname';
}

const user = new User();
console.log(user.loginCount);
```


## Changelog

### 2.1.0

- `setter`: you can provide transform function now

```js
class User {
  @setter(value => value && value.toUpperCase())
  @observable
  name;
}

const user = new User();
user.setName('Alice'); // user.name = 'ALICE'
```

- `save`, `createSaveDecorator`

### 2.0.0

- Adopting to mobx3

`observe` callback receive change argument now (
[more info](https://github.com/mobxjs/mobx/blob/master/CHANGELOG.md#other-changes)
)