import {observe as mobxObserve} from 'mobx'
import {isPropertyDecorator} from '../decorate'
import {attachInitializer} from '../utils'


export default function observe(handler, invokeImmediately) {
  if (isPropertyDecorator(arguments)) {
    throw new Error("@observe must be called with handler argument");
  }

  return (target, property, description) => {
    attachInitializer(target, store => {
      mobxObserve(store, property, handler.bind(store), invokeImmediately);
    });

    return {...description, configurable: true};
  }
}
