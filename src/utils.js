export function setterName(name, prefix = 'set') {
  const Name = capitalize(name);
  return prefix + Name;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isFunction(fn) {
  return typeof fn === 'function';
}

export function isString(str) {
  return typeof str === 'string';
}

export function isDefined(val) {
  return val !== undefined;
}

export function attachInitializer(target, init) {
  target.__mobxLazyInitializers = (target.__mobxLazyInitializers || []).slice();
  target.__mobxLazyInitializers.push(collectMobxInitializersAndRunInit);

  const nextIndex = target.__mobxLazyInitializers.length;
  const currentIndex = nextIndex - 1;

  function collectMobxInitializersAndRunInit(store) {
    // We need to run all mobx initializers before our init().
    // At the first function call we collect all next mobx initializers
    // run them and our init()
    // and replace this mobx initializers by stubs in __mobxLazyInitializers
    // to prevent duplicate runs.
    // On next calls (other class instances) this mobx initializers
    // will be called by runInit().

    function findNextMobxInitializers(someStore) {
      return someStore.__mobxLazyInitializers
        .slice(nextIndex)
        .filter(initializer => !initializer.__mobxDecoratorsInternal);
    }

    function getStubReplacer(someStore) {
      function stub() {}
      stub.__mobxDecoratorsInternal = true;

      return initializer => {
        const i = someStore.__mobxLazyInitializers.indexOf(initializer);
        someStore.__mobxLazyInitializers[i] = stub;
      }
    }

    function stubAllNextMobxInitializers(someStore) {
      const initializers = findNextMobxInitializers(someStore);
      initializers.forEach(getStubReplacer(someStore));
      return initializers;
    }


    let nextMobxInitializers = [];

    function runInit(someStore) {
      // check new mobx initializers was added after last call
      const extraInitializers = stubAllNextMobxInitializers(someStore);
      nextMobxInitializers = nextMobxInitializers.concat(extraInitializers);

      nextMobxInitializers.forEach(initializer => initializer(someStore));
      init(someStore);
    }
    runInit.__mobxDecoratorsInternal = true;

    store.__mobxLazyInitializers[currentIndex] = runInit;
    runInit(store);
  }
  collectMobxInitializersAndRunInit.__mobxDecoratorsInternal = true;
}
