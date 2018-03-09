export function decorate(withArgs, args, decorator) {
  return withArgs ? decorator : decorator(...args);
}

export function isPropertyDecorator(args) {
  return (
    args.length === 3 &&
    typeof args[0] === 'object' &&
    typeof args[1] === 'string' &&
    typeof args[2] === 'object'
  )
}

export function isClassDecorator(args) {
  return (
    args.length === 1 &&
    typeof args[0] === 'function'
  )
}
