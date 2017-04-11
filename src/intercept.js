import {intercept as mobxIntercept} from 'mobx'
import {invokedWithArgs, attachInitializer} from './utils'


export default function intercept(handler) {
  if (!invokedWithArgs(arguments)) {
    throw new Error("@intercept must be called with handler argument");
  }

  return (target, property) => {
    attachInitializer(target, store => {
      mobxIntercept(store, property, handler.bind(store));
    });
  }
}
