export function isFunction(fn) {
  return typeof fn === 'function';
}

export function isString(str) {
  return typeof str === 'string';
}

export function isDefined(val) {
  return val !== undefined;
}

export function isNull(val) {
  return val === null;
}
