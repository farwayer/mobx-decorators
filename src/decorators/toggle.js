import {action} from 'mobx'
import {decorate, isPropertyDecorator, setterName} from '../utils'


function getDecorator(name) {
  return (target, property, description) => {
    const fnName = name || setterName(property, 'toggle');

    const fnDesc = action.bound(target, fnName, {
      value: function () {
        this[property] = !this[property];
      }
    });
    Object.defineProperty(target, fnName, fnDesc);

    return description && {...description, configurable: true};
  }
}

export default function toggle(name) {
  const withArgs = !isPropertyDecorator(arguments);
  if (!withArgs) name = undefined;

  const decorator = getDecorator(name);
  return decorate(withArgs, arguments, decorator);
}
