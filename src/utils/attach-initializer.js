import {spy} from 'mobx'


export default function attachInitializer(target, property, init) {
  spy(({type, object: store, key}) => {
    if (!target.isPrototypeOf(store)) return;
    if (type !== 'add') return;
    if (property && key !== property) return;

    init(store);
  })
}
