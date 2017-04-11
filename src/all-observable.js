import {observable} from 'mobx'
import difference from 'lodash.difference'
import intersection from 'lodash.intersection'
import {invokedWithArgsForClass, decorate} from './utils'


export default function allObservable({
  only,
  except,
}) {
  const withArgs = invokedWithArgsForClass(arguments);

  function decorator(target) {
    return (...args) => {
      const store = new target(...args);

      let props = Object.keys(store);
      if (only) {
        props = intersection(props, only);
      }
      props = difference(props, except);

      props.forEach(prop => {
        const desc = Object.getOwnPropertyDescriptor(store, prop);
        observable(store, prop, desc);
      });

      return store;
    }
  }

  return decorate(withArgs, decorator, arguments);
}