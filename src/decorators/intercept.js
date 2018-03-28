import {intercept as mobxIntercept} from 'mobx'
import {attachInitializer, isPropertyDecorator} from '../utils'


export default function intercept(handler) {
  if (isPropertyDecorator(arguments)) {
    throw new Error("@intercept must be called with handler argument");
  }

  return (target, property, description) => {
    attachInitializer(target, property, store => {
      mobxIntercept(store, property, handler.bind(store));
    });

    return description && {...description, configurable: true};
  }
}
