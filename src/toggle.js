import {action} from 'mobx'
import {invokedWithArgs, setterName, decorate} from './utils'


export default function toggle(customName) {
  const withArgs = invokedWithArgs(arguments);

  function decorator(target, property, description) {
    const fnName = (withArgs && customName) || setterName(property, 'toggle');

    Object.defineProperty(target, fnName, {
      @action
      value: function () {
        this[property] = !this[property];
      }
    });

    return {...description, configurable: true};
  }

  return decorate(withArgs, decorator, arguments);
}
