// packages/reactivity/src/effect.ts
function effect() {
}

// packages/shared/src/index.ts
var isObject = (value) => typeof value === "object" && value !== null;

// packages/reactivity/src/reactive.ts
function reactive(target) {
  return createReactive(target);
}
var globalProxyTarget = /* @__PURE__ */ new WeakMap();
var handlers = {
  get(target, key) {
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    return Reflect.set(target, key, value);
  }
};
function createReactive(target) {
  if (!isObject(target)) {
    return target;
  }
  if (globalProxyTarget.has(target)) {
    return globalProxyTarget.get(target);
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return target;
  }
  const proxyTarget = new Proxy(target, handlers);
  proxyTarget["__v_isReactive" /* IS_REACTIVE */] = true;
  globalProxyTarget.set(target, proxyTarget);
  return proxyTarget;
}
export {
  effect,
  reactive
};
