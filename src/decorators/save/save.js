import {runInAction} from 'mobx'
import {propertyDecorator} from 'decorating'
import observe from '../observe'
import {isDefined, isNull, isFunction} from '../../utils'


const save = propertyDecorator((target, prop, desc, {
  storage,
  storeName = store => store.storeName,
  serializer: {
    load: serializerLoad = data => JSON.parse(data),
    save: serializerSave = value => JSON.stringify(value),
  } = {},
  onLoaded = () => {},
  onSaved = () => {},
  onInitialized = () => {},
} = {}) => {
  if (!storage) {
    throw new Error("Storage must be defined");
  }

  const status = new Status();

  return observe(async function ({newValue: value}) {
    const store = this;
    const key = storageKey(store, storeName, prop);

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
            store[prop] = value;
          });

          onLoaded.call(store, store, prop, value);
        }

        status.set(key, Status.Initialized);

        value = store[prop];
        onInitialized.call(store, store, prop, value);
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

        onSaved.call(store, store, prop, value);
        break;
      }
    }
  }, true)(target, prop, desc);
});

export default save;

export function createDecorator(storage, baseOptions) {
  baseOptions = {storage, ...baseOptions};

  return propertyDecorator((target, prop, desc, options) => {
    options = {...baseOptions, ...options};
    return save(options)(target, prop, desc);
  })
}

function storageKey(store, storeName, property) {
  if (isFunction(storeName)) {
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
