import {action} from 'mobx'
import {decorate, isPropertyDecorator} from '../decorate';
import {setterName} from '../utils'


function getDecorator(name) {
  return (target, property, description) => {
    const fnName = name || setterName(property, 'toggle');

    Object.defineProperty(target, fnName, {
      @action
      value: function () {
        this[property] = !this[property];
      }
    });

    return {...description, configurable: true};
  }
}

export default function toggle(name) {
  const withArgs = !isPropertyDecorator(arguments);

  if (!withArgs) name = undefined;

  const decorator = getDecorator(name);
  return decorate(withArgs, arguments, decorator);
}
