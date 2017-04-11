import {runInAction} from 'mobx'
import observe from '../observe'
import {invokedWithArgs, decorate} from '../utils'


const Status = {
  NotInitialized: undefined,
  Loading: 1,
  SettingLoadedValue: 2,
  Initialized: 3,
};


export function createDecorator(storage, baseOptions = {}) {
  baseOptions = {storage, ...baseOptions};

  return function (options) {
    if (!invokedWithArgs(arguments)) {
      return save(baseOptions)(...arguments);
    }

    options = {...baseOptions, ...options};
    return save(options);
  }
}


export default function save({
  storage,
  storeName,
  transform = item => item,
  onLoaded = () => {},
  onSaved = () => {},
  onInitialized = () => {},
} = {}) {
  if (!storage) {
    throw new Error("Storage must be defined");
  }

  const withArgs = invokedWithArgs(arguments);

  function decorator(target, property, description) {
    const status = new PropertyStatus();

    return observe(async function ({newValue: value}) {
      const store = this;
      const key = storageKey(store, storeName, property);

      switch (status.get(key)) {
        case Status.NotInitialized: {
          status.set(key, Status.Loading);

          value = await loadValue(storage, key, transform);

          // check value was loaded and property was not modified by user
          if (value !== undefined && status.get(key) === Status.Loading) {
            status.set(key, Status.SettingLoadedValue);

            runInAction(`loading ${key} from storage`, () => {
              store[property] = value;
            });

            onLoaded(store, property, value);
          }

          status.set(key, Status.Initialized);

          onInitialized(store, property, value);
          break;
        }

        case Status.SettingLoadedValue:
          status.set(key, Status.Initialized);
          break;

        // property was modified by user while loading
        case Status.Loading: {
          status.set(key, Status.Initialized);

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
      "`storeName` must be defined as property in store or passed as option " +
      "to @save decorator"
    );
  }

  return `${storeName}:${property}`;
}

class PropertyStatus {
  statuses = {};

  set(key, status) {
    this.statuses[key] = status;
  }

  get(key) {
    return this.statuses[key];
  }
}
