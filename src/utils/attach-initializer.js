import {spy} from 'mobx'
import {version} from 'mobx/package'


export default function attachInitializer(target, property, init) {
  const major = version.split('.')[0];
  if (major > 4) {
    console.warn(`MobX >4 is not supported yet`)
  }

  spy(({type, object: store, key}) => {
    if (type !== 'add') return;
    if (property && key !== property) return;
    if (!target.isPrototypeOf(store)) return;

    init(store);
  })
}
