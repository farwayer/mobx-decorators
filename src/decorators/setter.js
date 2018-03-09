import {action} from 'mobx'
import {decorate, isPropertyDecorator} from '../decorate'
import {setterName, isFunction, isString, isDefined} from '../utils'


function getDecorator(name, customValue) {
  if (!isString(name)) {
    customValue = name;
    name = undefined;
  }

  return (target, property, description) => {
    const fnName = name || setterName(property);

    Object.defineProperty(target, fnName, {
      @action
      value: function (value) {
        if (isDefined(customValue)) {
          value = isFunction(customValue)
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
  const withArgs = !isPropertyDecorator(arguments);

  if (!withArgs) name = customValue = undefined;

  const decorator = getDecorator(name, customValue);
  return decorate(withArgs, arguments, decorator);
}
