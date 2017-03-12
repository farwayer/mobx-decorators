export function decorate(withArgs, decorator, args) {
  return withArgs ? decorator : decorator(...args);
}

export function invokedWithArgs(args) {
  return (
    args.length !== 3 ||
    typeof args[0] !== 'object' ||
    typeof args[1] !== 'string' ||
    typeof args[2] !== 'object'
  )
}

export function setterName(name, prefix = 'set') {
  const Name = capitalize(name);
  return prefix + Name;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function attachInitializers(target, {set, get}, init) {
  if (!set || !get) throw new Error("set or get undefined");

  target.__mobxLazyInitializers = (target.__mobxLazyInitializers || []).slice();
  target.__mobxLazyInitializers.push(init);
}
