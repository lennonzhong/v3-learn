// packages/reactivity/src/effect.ts
var targetEffect;
function effect(fn, options) {
  let __effect = new ReactiveEffect(fn, () => {
    __effect.run();
  });
  __effect.run();
}
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
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
function track(target, key) {
  if (targetEffect) {
    console.log(target, key, targetEffect);
  }
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
