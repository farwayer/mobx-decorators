import {action} from 'mobx'
import {invokedWithArgs, setterName, decorate} from './utils'


export default function toggle(customName) {
  const withArgs = invokedWithArgs(arguments);

  function decorator(target, name) {
    const fnName = (withArgs && customName) || setterName(name, 'toggle');

    Object.defineProperty(target, fnName, {
      @action
      value: function () {
        this[name] = !this[name];
      }
    })
  }

  return decorate(withArgs, decorator, arguments);
}
