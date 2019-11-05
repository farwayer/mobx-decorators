import {observable} from 'mobx'
import {classDecorator} from 'decorating'
import {difference, intersection} from 'rambda'


export default classDecorator((target, {only, except} = {}) => {
  return (...args) => {
    const store = new target(...args);

    let props = Object.keys(store);
    if (only) {
      props = intersection(props, only);
    }
    props = difference(props, except);

    props.forEach(prop => {
      let desc = Object.getOwnPropertyDescriptor(store, prop);
      desc = observable(store, prop, desc);
      Object.defineProperty(store, prop, desc);
    });

    return store;
  }
})
