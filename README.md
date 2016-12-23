## Installation

```bash
npm install --save mobx-decorators
```

You also should use some transpiler (like babel).

```bash
npm install --save-dev babel-preset-es2015 \
  babel-plugin-transform-decorators-legacy \
  babel-plugin-transform-object-rest-spread
```

## Examples

```js
import {observable} from 'mobx'
import {setter, toggle, intercept, observe} from 'mobx-decorators'

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
  @setter('updateLoggedIn')
  @observable
  loggedIn = false;
}

const user = new User();
user.updateLoggedIn(true); // user.loggedIn = true
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

```js
const invokeImmediately = true;

class User {
  @observe((newValue, oldValue) => {
    console.log(newValue, oldValue);
  }, invokeImmediately)
  @setter
  @observable
  loggedIn = false;
}

const user = new User(); // console.log(false, undefined)
user.setLoggedIn(true); // console.log(true, false)
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

## API

### @setter, @setter(name, [constValue])

Create setter for `property` with `setProperty` or custom name.
If `constValue` provided this value will be set every time setter called.

### @toggle, @toggle(name)

Toggle boolean property (`property = !property`).

### @observe(handler, [invokeImmediately])

**Must be defined before @observable**

Handler will be called after property change.
If `invokeImmediately` is `true` handler will be called one time right after
initialization.

More info can be found in
[mobx docs](https://mobxjs.github.io/mobx/refguide/observe.html)

### @intercept(handler)

**Must be defined before @observable**

Handler will be called before property change. You can replace value
or cancel change in handler.

More info can be found in
[mobx docs](https://mobxjs.github.io/mobx/refguide/observe.html)
