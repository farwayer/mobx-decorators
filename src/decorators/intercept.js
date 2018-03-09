import {intercept as mobxIntercept} from 'mobx'
import {isPropertyDecorator} from '../decorate'
import {attachInitializer} from '../utils'


export default function intercept(handler) {
  if (isPropertyDecorator(arguments)) {
    throw new Error("@intercept must be called with handler argument");
  }

  return (target, property, description) => {
    attachInitializer(target, store => {
      mobxIntercept(store, property, handler.bind(store));
    });

    return {...description, configurable: true};
  }
}
