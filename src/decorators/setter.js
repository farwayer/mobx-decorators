import {action} from 'mobx'
import {invokedWithArgs, setterName, decorate} from '../utils'


function getDecorator(withArgs, name, customValue) {
  return (target, property, description) => {
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
            ? customValue.call(this, value)
            : customValue;
        }

        this[property] = value;
      }
    });

    return {...description, configurable: true};
  }
}

export default function setter(name, customValue) {
  const withArgs = invokedWithArgs(arguments);
  const decorator = getDecorator(withArgs, name, customValue);
  return decorate(withArgs, decorator, arguments);
}
