export function decorate(withArgs, decorator, args) {
  return withArgs ? decorator : decorator(...args);
}

export function invokedWithArgs(args) {
  return (
    args.length !== 3 ||
    typeof args[0] !== 'object' ||
    typeof args[1] !== 'string' ||
    typeof args[2] !== 'object'
  )
}

export function invokedWithArgsForClass(args) {
  return (
    args.length !== 1 ||
    typeof args[0] !== 'function'
  )
}

export function setterName(name, prefix = 'set') {
  const Name = capitalize(name);
  return prefix + Name;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function attachInitializer(target, init) {
  function runInit(store) {
    // run all next initializers before our init
    // can be recursive
    const nextIndex = store.__mobxLazyInitializers.indexOf(runInit) + 1;

    while (true) {
      const initializer = store.__mobxLazyInitializers[nextIndex];
      if (!initializer) break;

      initializer(store);
      store.__mobxLazyInitializers.splice(nextIndex, 1);
    }

    init(store);
  }

  target.__mobxLazyInitializers = (target.__mobxLazyInitializers || []).slice();
  target.__mobxLazyInitializers.push(runInit);
}
