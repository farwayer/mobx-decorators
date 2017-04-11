import {observe as mobxObserve} from 'mobx'
import {invokedWithArgs, attachInitializer} from './utils'


export default function observe(handler, invokeImmediately) {
  if (!invokedWithArgs(arguments)) {
    throw new Error("@observe must be called with handler argument");
  }

  return (target, property) => {
    attachInitializer(target, store => {
      mobxObserve(store, property, handler.bind(store), invokeImmediately);
    });
  }
}
