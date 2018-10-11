import {observe} from 'mobx'
import {propertyDecorator} from 'decorating'
import {attachInitializer} from '../utils'


export default propertyDecorator((target, prop, desc, handler, invokeImmediately) => {
  if (!handler) throw new Error("@observe must be called with handler argument");

  attachInitializer(target, prop, store => {
    observe(store, prop, handler.bind(store), invokeImmediately);
  });

  return desc && {...desc, configurable: true};
})
