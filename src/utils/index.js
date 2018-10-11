export attachInitializer from './attach-initializer'
export {isFunction, isString, isDefined, isNull} from './is'

export function setterName(name, prefix = 'set') {
  const Name = capitalize(name);
  return prefix + Name;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
