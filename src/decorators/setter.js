import {action} from 'mobx'
import {
  decorate, isPropertyDecorator,
  setterName, isFunction, isString, isDefined,
} from '../utils'


function getDecorator(name, customValue) {
  if (!isString(name)) {
    customValue = name;
    name = undefined;
  }

  return (target, property, description) => {
    const fnName = name || setterName(property);

    const fnDesc = action.bound(target, fnName, {
      value: function (value) {
        if (isDefined(customValue)) {
          value = isFunction(customValue)
            ? customValue.call(this, value)
            : customValue;
        }

        this[property] = value;
      }
    });
    Object.defineProperty(target, fnName, fnDesc);

    return description && {...description, configurable: true};
  }
}

export default function setter(name, customValue) {
  const withArgs = !isPropertyDecorator(arguments);
  if (!withArgs) name = customValue = undefined;

  const decorator = getDecorator(name, customValue);
  return decorate(withArgs, arguments, decorator);
}
