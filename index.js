import {action, intercept as mobxIntercept, observe as mobxObserve} from 'mobx'


export function setter(customName, customValue) {
  const withArgs = invokedWithArgs(arguments);

  function decorator(target, name) {
    const fnName = (withArgs && customName) || setterName(name);

    Object.defineProperty(target, fnName, {
      @action
      value: function (value) {
        if (withArgs && typeof customValue !== 'undefined') {
          value = customValue;
        }

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
      value: function () {
        this[name] = !this[name];
      }
    })
  }

  return decorate(withArgs, decorator, arguments);
}

export function intercept(handler) {
  if (!invokedWithArgs(arguments)) {
    throw new Error("@intercept must be called with handler argument");
  }

  return (target, name, description) => {
    try {
      attachInitializers(target, description, obj => {
        mobxIntercept(obj, name, handler.bind(obj));
      })
    } catch (error) {
      throw new Error("@intercept must be defined before @observable");
    }
  }
}

export function observe(handler, invokeImmediately) {
  if (!invokedWithArgs(arguments)) {
    throw new Error("@observe must be called with handler argument");
  }

  return (target, name, description) => {
    try {
      attachInitializers(target, description, obj => {
        mobxObserve(obj, name, handler.bind(obj), invokeImmediately);
      })
    } catch (error) {
      throw new Error("@observe must be defined before @observable");
    }
  }
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

function attachInitializers(target, {set, get}, init) {
  if (!set || !get) throw new Error("set or get undefined");

  target.__mobxLazyInitializers = (target.__mobxLazyInitializers || []).slice();
  target.__mobxLazyInitializers.push(init);
}
