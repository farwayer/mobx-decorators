import {intercept as mobxIntercept} from 'mobx'
import {invokedWithArgs, attachInitializers} from './utils'


export default function intercept(handler) {
  if (!invokedWithArgs(arguments)) {
    throw new Error("@intercept must be called with handler argument");
  }

  return (target, name, description) => {
    try {
      attachInitializers(target, description, obj => {
        mobxIntercept(obj, name, handler.bind(obj));
      })
    } catch (error) {
      throw new Error("@intercept must be defined before @observable");
    }
  }
}
