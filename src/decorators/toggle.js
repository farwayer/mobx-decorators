import {action} from 'mobx'
import {invokedWithArgs, setterName, decorate} from '../utils'


function getDecorator(withArgs, customName) {
  return (target, property, description) => {
    const fnName = (withArgs && customName) || setterName(property, 'toggle');

    Object.defineProperty(target, fnName, {
      @action
      value: function () {
        this[property] = !this[property];
      }
    });

    return {...description, configurable: true};
  }
}

export default function toggle(customName) {
  const withArgs = invokedWithArgs(arguments);
  const decorator = getDecorator(withArgs, customName);
  return decorate(withArgs, decorator, arguments);
}
