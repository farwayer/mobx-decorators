import {_interceptReads} from 'mobx'
import {propertyDecorator} from 'decorating'
import {attachInitializer} from '../utils'


export default propertyDecorator((target, prop, desc, handler) => {
  if (!handler) throw new Error("@interceptReads must be called with handler argument");

  attachInitializer(target, prop, store => {
    _interceptReads(store, prop, handler.bind(store));
  });

  return desc && {...desc, configurable: true};
})
