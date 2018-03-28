import {_interceptReads as _mobxInterceptReads} from 'mobx'
import {attachInitializer, isPropertyDecorator} from '../utils'


export default function _interceptReads(handler) {
  if (isPropertyDecorator(arguments)) {
    throw new Error("@interceptReads must be called with handler argument");
  }

  return (target, property, description) => {
    attachInitializer(target, property, store => {
      _mobxInterceptReads(store, property, handler.bind(store));
    });

    return description && {...description, configurable: true};
  }
}
