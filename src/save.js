import {runInAction} from 'mobx'
import observe from './observe'
import {invokedWithArgs, decorate} from './utils'


const Status = {
  NotInitialized: undefined,
  Loading: 1,
  SettingLoadedValue: 2,
  Initialized: 3,
};


export default function save({
  storage = defaultStorage(),
  storeName,
  transform = item => item,
  onLoaded = () => {},
  onSaved = () => {},
  onInitialized = () => {},
} = {}) {
  const withArgs = invokedWithArgs(arguments);

  function decorator(target, property, description) {
    let status = Status.NotInitialized;

    return observe(async function ({newValue: value}) {
      const store = this;
      const key = storageKey(store, storeName, property);

      switch (status) {
        case Status.NotInitialized: {
          status = Status.Loading;

          value = await loadValue(storage, key, transform);

          // check value was loaded and property was not modified by user
          if (value !== undefined && status === Status.Loading) {
            status = Status.SettingLoadedValue;

            runInAction(`loading ${key} from storage`, () => {
              store[property] = value;
            });

            onLoaded(store, property, value);
          }

          onInitialized(store, property, value);
          break;
        }

        case Status.SettingLoadedValue: {
          status = Status.Initialized;
          break;
        }

        // property was modified by user while loading
        case Status.Loading: {
          status = Status.Initialized;

          const saved = await saveValue(storage, key, value);
          if (!saved) break;

          onSaved(store, property, value);
          break;
        }

        case Status.Initialized: {
          const saved = await saveValue(storage, key, value);
          if (!saved) break;

          onSaved(store, property, value);
          break;
        }
      }
    }, true)(target, property, description);
  }

  return decorate(withArgs, decorator, arguments);
}

async function loadValue(storage, key, transform) {
  const json = await storage.getItem(key);
  if (!json) return;

  return transform(JSON.parse(json));
}

async function saveValue(storage, key, value) {
  const json = JSON.stringify(value);
  if (!json) return;

  await storage.setItem(key, json);
  return true;
}

function storageKey(store, storeName=store.storeName, property) {
  if (!storeName) {
    throw new Error(
      "You must define `storeName` property in store or pass it as option to " +
      "@save"
    );
  }

  return `${storeName}:${property}`;
}

function defaultStorage() {
  if (typeof navigator === 'undefined') {
    return MemoryStorage;
  }

  switch (navigator.product) {
    case 'ReactNative':
      return require('react-native').AsyncStorage;

    default:
      return AsyncLocalStorage;
  }
}

export class AsyncLocalStorage {
  static async getItem(key) {
    return localStorage.getItem(key);
  }
  static async setItem(key, value) {
    return localStorage.setItem(key, value);
  }
}

export class MemoryStorage {
  static db = {};

  static async getItem(key) {
    return MemoryStorage.db[key];
  }
  static async setItem(key, value) {
    return MemoryStorage.db[key] = value;
  }
}
