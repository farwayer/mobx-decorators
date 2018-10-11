import {intercept} from 'mobx'
import {propertyDecorator} from 'decorating'
import {attachInitializer} from '../utils'


export default propertyDecorator((target, prop, desc, handler) => {
  if (!handler) throw new Error("@intercept must be called with handler argument");

  attachInitializer(target, prop, store => {
    intercept(store, prop, handler.bind(store));
  });

  return desc && {...desc, configurable: true};
})
