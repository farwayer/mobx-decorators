import {action} from 'mobx'
import {propertyDecorator} from 'decorating'
import {setterName} from '../utils'


export default propertyDecorator((
  target, prop, desc,
  name = setterName(prop, 'toggle'),
) => {
  const fnDesc = action.bound(target, name, {
    value: function () {
      this[prop] = !this[prop];
    }
  });
  Object.defineProperty(target, name, fnDesc);

  return desc && {...desc, configurable: true};
});
