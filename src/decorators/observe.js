import {observe as mobxObserve} from 'mobx'
import {attachInitializer, isPropertyDecorator} from '../utils'


export default function observe(handler, invokeImmediately) {
  if (isPropertyDecorator(arguments)) {
    throw new Error("@observe must be called with handler argument");
  }

  return (target, property, description) => {
    attachInitializer(target, property, store => {
      mobxObserve(store, property, handler.bind(store), invokeImmediately);
    });

    return description && {...description, configurable: true};
  }
}
