### Examples

```js
import {observable} from 'mobx'
import {setter, toggle, set, intercept, observe} from 'mobx-decorators'

const invokeImmediately = true;

class User {
  @setter
  @toggle
  @set('login', true)
  @set('logout', false)
  @intercept(change => {
    console.log(change.newValue);
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
