import {spy} from 'mobx'


export default function attachInitializer(target, property, init) {
  spy(({type, object: store, key}) => {
    if (type !== 'add') return;
    if (property && key !== property) return;
    if (!target.isPrototypeOf(store)) return;

    init(store);
  })
}
