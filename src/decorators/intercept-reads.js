import {extras} from 'mobx'
import {isPropertyDecorator} from '../decorate'
import {attachInitializer} from '../utils'


export default function interceptReads(handler) {
  if (isPropertyDecorator(arguments)) {
    throw new Error("@interceptReads must be called with handler argument");
  }

  return (target, property, description) => {
    attachInitializer(target, store => {
      extras.interceptReads(store, property, handler.bind(store));
    });

    return {...description, configurable: true};
  }
}
