## Changelog

### 6.0.0

- React Native async storage from community repo

### 5.0.6

- revert warn for mobx >4

### 5.0.5

- up deps
- warn for mobx >4

### 5.0.3

- esm: remove `esmodules` from babel env config (fix the problem with webpack uglify)
- add TS typings to npm build
- (internal) using [decorating](https://github.com/farwayer/decorating) lib for more clean code 

### 5.0.2

- fix babel runtime import; lock @babel rc version

### 5.0.1

- new babel transform fixes

### 5.0.0

- interpret null value from storage as non-existent (localStorage returns null
for non-existent keys)  
Bump major version because it can be back incompatible.
- .native postfix for React Native

### 4.1.0

- separate esm build

### 4.0.0

- MobX4
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
