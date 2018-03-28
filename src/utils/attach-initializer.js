import {spy} from 'mobx'


export default function attachInitializer(target, property, init) {
  const stopSpy = spy(({type, object: store, key}) => {
    if (!target.isPrototypeOf(store)) return;
    if (type !== 'add') return;
    if (property && key !== property) return;

    stopSpy();
    init(store, property);
  })
}
