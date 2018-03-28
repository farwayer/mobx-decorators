import {spy} from 'mobx'


export default function attachInitializer(target, property, init) {
  const stopSpy = spy(({type, object: store, key}) => {
    if (!target.isPrototypeOf(store)) return;
    if (type !== 'add') return;
    if (property && key !== property) return;

    setTimeout(stopSpy); // https://github.com/mobxjs/mobx/issues/1459
    init(store, property);
  })
}
