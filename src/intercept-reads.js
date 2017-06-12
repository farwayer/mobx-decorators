import {extras} from 'mobx'
import {invokedWithArgs, attachInitializer} from './utils'


export default function interceptReads(handler) {
  if (!invokedWithArgs(arguments)) {
    throw new Error("@interceptReads must be called with handler argument");
  }

  return (target, property, description) => {
    attachInitializer(target, store => {
      extras.interceptReads(store, property, handler.bind(store));
    });

    return {...description, configurable: true};
  }
}
