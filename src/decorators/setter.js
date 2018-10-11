import {action} from 'mobx'
import {propertyDecorator} from 'decorating'
import {setterName, isFunction, isString, isDefined} from '../utils'


export default propertyDecorator((target, prop, desc, name, customValue) => {
  if (!isString(name)) {
    customValue = name;
    name = undefined;
  }

  name = name || setterName(prop);

  const fnDesc = action.bound(target, name, {
    value: function (value) {
      if (isDefined(customValue)) {
        value = isFunction(customValue)
          ? customValue.call(this, value)
          : customValue;
      }

      this[prop] = value;
    }
  });
  Object.defineProperty(target, name, fnDesc);

  return desc && {...desc, configurable: true};
})
