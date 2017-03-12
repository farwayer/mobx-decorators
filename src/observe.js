import {observe as mobxObserve} from 'mobx'
import {invokedWithArgs, attachInitializers} from './utils'


export default function observe(handler, invokeImmediately) {
  if (!invokedWithArgs(arguments)) {
    throw new Error("@observe must be called with handler argument");
  }

  return (target, name, description) => {
    try {
      attachInitializers(target, description, obj => {
        mobxObserve(obj, name, handler.bind(obj), invokeImmediately);
      })
    } catch (error) {
      throw new Error("@observe must be defined before @observable");
    }
  }
}
