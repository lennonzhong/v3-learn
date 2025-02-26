// packages/reactivity/src/effect.ts
function effect(fn, options) {
  let __effect = new ReactiveEffect(fn, () => {
    __effect.run();
  });
  __effect.run();
}
var targetEffect;
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.effectId = 0;
    this.active = true;
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let lastEffect = targetEffect;
    targetEffect = this;
    try {
      return this.fn();
    } finally {
      targetEffect = lastEffect;
    }
  }
};

// packages/shared/src/index.ts
var isObject = (value) => typeof value === "object" && value !== null;

// packages/reactivity/src/reactiveEffect.ts
function createDep(cleanup, name) {
  let dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.name = name;
  return dep;
}
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (targetEffect) {
    let depMap = targetMap.get(target);
    if (!depMap) {
      targetMap.set(target, depMap = /* @__PURE__ */ new Map());
    }
    let deps = depMap.get(key);
    if (!deps) {
      depMap.set(key, deps = createDep(() => {
        depMap.delete(key);
      }, key));
    }
    trackDep(targetEffect, deps);
    console.log(targetMap);
  }
}
function trackDep(effect2, deps) {
  deps.set(effect2, effect2.effectId);
}

// packages/reactivity/src/baseHandler.ts
var handlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver);
  }
};

// packages/reactivity/src/reactive.ts
var globalProxyTarget = /* @__PURE__ */ new WeakMap();
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
  globalProxyTarget.set(target, proxyTarget);
  return proxyTarget;
}
function reactive(target) {
  return createReactive(target);
}
export {
  effect,
  reactive,
  targetEffect
};
