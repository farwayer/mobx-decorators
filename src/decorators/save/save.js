import {runInAction} from 'mobx'
import observe from '../observe'
import {decorate, isPropertyDecorator, isDefined, isNull} from '../../utils'


export function createDecorator(storage, baseOptions = {}) {
  baseOptions = {storage, ...baseOptions};

  return function (options) {
    if (isPropertyDecorator(arguments)) {
      return save(baseOptions)(...arguments);
    }

    options = {...baseOptions, ...options};
    return save(options);
  }
}

function getDecorator({
  storage,
  storeName = store => store.storeName,
  serializer: {
    load: serializerLoad = data => JSON.parse(data),
    save: serializerSave = value => JSON.stringify(value),
  } = {},
  onLoaded = () => {},
  onSaved = () => {},
  onInitialized = () => {},
} = {}) {
  if (!storage) {
    throw new Error("Storage must be defined");
  }

  return (target, property, description) => {
    const status = new Status();

    return observe(async function ({newValue: value}) {
      const store = this;
      const key = storageKey(store, storeName, property);

      // user modified value while loading; loaded value will be ignored
      if (status.isLoading(key)) {
        status.set(key, Status.Initialized);
      }

      switch (status.get(key)) {
        case Status.NotInitialized: {
          status.set(key, Status.Loading);

          const data = await storage.getItem(key);

          // check value exists and property was not modified by user
          if (isExists(data) && status.isLoading(key)) {
            status.set(key, Status.SettingLoadedValue);

            value = serializerLoad.call(store, data);

            runInAction(`set ${key} loaded from storage`, () => {
              store[property] = value;
            });

            onLoaded.call(store, store, property, value);
          }

          status.set(key, Status.Initialized);

          value = store[property];
          onInitialized.call(store, store, property, value);
          break;
        }

        case Status.SettingLoadedValue: {
          status.set(key, Status.Initialized);
          break;
        }

        case Status.Initialized: {
          const data = serializerSave.call(store, value);
          if (!data) break;

          await storage.setItem(key, data);

          onSaved.call(store, store, property, value);
          break;
        }
      }
    }, true)(target, property, description);
  }
}

export default function save(options) {
  const withArgs = !isPropertyDecorator(arguments);
  const decorator = getDecorator(options);
  return decorate(withArgs, arguments, decorator);
}

function storageKey(store, storeName, property) {
  if (typeof storeName === 'function') {
    storeName = storeName.call(store, store);
  }

  if (!storeName) {
    throw new Error(
      "`storeName` must be defined as property in store or passed as option " +
      "to @save decorator"
    );
  }

  return `${storeName}:${property}`;
}

class Status {
  static NotInitialized = undefined;
  static Loading = 1;
  static SettingLoadedValue = 2;
  static Initialized = 3;

  statuses = {};

  set(key, status) {
    this.statuses[key] = status;
  }

  get(key) {
    return this.statuses[key];
  }

  isLoading(key) {
    return this.get(key) === Status.Loading;
  }
}

function isExists(data) {
  return isDefined(data) && !isNull(data);
}
