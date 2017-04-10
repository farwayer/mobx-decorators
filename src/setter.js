import {action} from 'mobx'
import {invokedWithArgs, setterName, decorate} from './utils'


export default function setter(name, customValue) {
  const withArgs = invokedWithArgs(arguments);

  function decorator(target, property, description) {
    if (!withArgs) {
      name = undefined;
      customValue = undefined;
    }

    if (typeof name !== 'string') {
      customValue = name;
      name = undefined;
    }

    name = name || setterName(property);

    Object.defineProperty(target, name, {
      @action
      value: function (value) {
        if (customValue !== undefined) {
          value = typeof customValue === 'function'
            ? customValue(value)
            : customValue;
        }

        this[property] = value;
      }
    });

    return {...description, configurable: true};
  }

  return decorate(withArgs, decorator, arguments);
}
