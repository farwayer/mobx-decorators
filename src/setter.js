import {action} from 'mobx'
import {invokedWithArgs, setterName, decorate} from './utils'


export default function setter(customName, customValue) {
  const withArgs = invokedWithArgs(arguments);

  function decorator(target, property) {
    const fnName = (withArgs && customName) || setterName(property);

    Object.defineProperty(target, fnName, {
      @action
      value: function (value) {
        if (withArgs && typeof customValue !== 'undefined') {
          value = customValue;
        }

        this[property] = value;
      }
    })
  }

  return decorate(withArgs, decorator, arguments);
}
