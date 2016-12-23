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

const invokeImmediately = true;

class User {
  @toggle
  @setter
  @setter('login', true)
  @setter('logout', false)
  @intercept(change => {
    console.log(change.newValue);
    return change;
  })
  @observe((newValue, oldValue) => {
    console.log(newValue, oldValue);
  }, invokeImmediately)
  @observable
  loggedIn = true;
  
  @setter('updateUserName')
  @observable
  name = "Jack";
  
  @toggle('swapTicket')
  @observable
  hasConcertTicket = true;
}

const user = new User();

user.setLoggedIn(true);
user.toggleLoggedIn();
user.login();
user.logout();

user.updateUserName('John');
user.swapTicket();
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
