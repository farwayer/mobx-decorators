import {createDecorator} from './save'


class AsyncLocalStorage {
  static async getItem(key) {
    return localStorage.getItem(key);
  }
  static async setItem(key, value) {
    return localStorage.setItem(key, value);
  }
}

class MemoryStorage {
  static db = {};

  static async getItem(key) {
    return MemoryStorage.db[key];
  }
  static async setItem(key, value) {
    return MemoryStorage.db[key] = value;
  }
}


const Storage = typeof navigator === 'undefined'
  ? MemoryStorage
  : AsyncLocalStorage;

export function createSaveDecorator(baseOptions) {
  return createDecorator(Storage, baseOptions);
}

export default createSaveDecorator()
