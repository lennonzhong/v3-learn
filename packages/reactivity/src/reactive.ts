import {isObject} from "@myvue/shared"
export function reactive(target) {
  // 代理只能代理对象类型  又因为reactive的方式有多种， 如shadowReactive等等 ，所以判断放到create里面去做
  return createReactive(target);
}

// 缓存一下已经代理过的对象, 多次调用reactive返回同一个对象
const globalProxyTarget = new WeakMap();

// 已经是响应式的对象再次reactive不做处理, 如何判断是否是已经代理过的对象？ 答：通过特殊的key判断
enum ReactiveFlag {
  IS_REACTIVE = "__v_isReactive"
}


const handlers:ProxyHandler<object> = {
  get(target, key) {
    return Reflect.get(target, key);
  },
  set(target,key,value) {
    return Reflect.set(target, key,value);
  }
}

function createReactive(target) {
  if(!isObject(target)) {
    return target;
  }

  if(globalProxyTarget.has(target)) {
    return globalProxyTarget.get(target);
  }

  if (target[ReactiveFlag.IS_REACTIVE]) {
    return target;
  }

  const proxyTarget = new Proxy(target, handlers)
  proxyTarget[ReactiveFlag.IS_REACTIVE] = true;
  globalProxyTarget.set(target, proxyTarget);
  return proxyTarget;
}