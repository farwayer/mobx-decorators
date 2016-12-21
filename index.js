import {action, intercept as mobxIntercept, observe as mobxObserve} from 'mobx'


export function setter(customName) {
  const withArgs = invokedWithArgs(arguments);

  function decorator(target, name) {
    const fnName = (withArgs && customName) || setterName(name);

    Object.defineProperty(target, fnName, {
      @action
      value: function(value) {
        this[name] = value;
      }
    })
  }

  return decorate(withArgs, decorator, arguments);
}

export function toggle(customName) {
  const withArgs = invokedWithArgs(arguments);

  function decorator(target, name) {
    const fnName = (withArgs && customName) || setterName(name, 'toggle');

    Object.defineProperty(target, fnName, {
      @action
      value: function() {
        this[name] = !this[name];
      }
    })
  }

  return decorate(withArgs, decorator, arguments);
}

export function set(customName, value) {
  return (target, name) => {
    Object.defineProperty(target, customName, {
      @action
      value: function() {
        this[name] = value;
      }
    })
  };
}

export function intercept(handler) {
  return (target, name, {initializer, value, ...description}) => ({
    ...description,
    writable: true,
    initializer: function() {
      // wait next tick to make sure observable initialized
      setTimeout(() => {
        mobxIntercept(this, name, handler);
      }, 0);

      return initializer ? initializer.call(this) : value;
    }
  })
}

export function observe(handler, invokeImmediately) {
  return (target, name, {initializer, value, ...description}) => ({
    ...description,
    writable: true,
    initializer: function() {
      // wait next tick to make sure observable initialized
      setTimeout(() => {
        mobxObserve(this, name, handler, invokeImmediately);
      }, 0);

      return initializer ? initializer.call(this) : value;
    }
  })
}


function decorate(withArgs, decorator, args) {
  return withArgs ? decorator : decorator(...args);
}

function invokedWithArgs(args) {
  return (
    args.length !== 3 ||
    typeof args[0] !== 'object' ||
    typeof args[1] !== 'string' ||
    typeof args[2] !== 'object'
  )
}

function setterName(name, prefix = 'set') {
  const Name = capitalize(name);
  return prefix + Name;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
