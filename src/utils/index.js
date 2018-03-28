export {decorate, isPropertyDecorator, isClassDecorator} from './decorate'
export attachInitializer from './attach-initializer'

export function setterName(name, prefix = 'set') {
  const Name = capitalize(name);
  return prefix + Name;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isFunction(fn) {
  return typeof fn === 'function';
}

export function isString(str) {
  return typeof str === 'string';
}

export function isDefined(val) {
  return val !== undefined;
}
