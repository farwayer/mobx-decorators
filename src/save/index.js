import {createSaveDecorator} from './save'


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


export default createSaveDecorator({
  storage: typeof navigator === 'undefined'
    ? MemoryStorage
    : AsyncLocalStorage
})

export {createSaveDecorator}
