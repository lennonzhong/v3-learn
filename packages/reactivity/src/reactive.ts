import {isObject} from "@myvue/shared"
import { handlers, ReactiveFlag } from "./baseHandler";

// 缓存一下已经代理过的对象, 多次调用reactive返回同一个对象
const globalProxyTarget = new WeakMap();

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
  globalProxyTarget.set(target, proxyTarget);
  return proxyTarget;
}


export function reactive(target) {
  // 代理只能代理对象类型  又因为reactive的方式有多种， 如shadowReactive等等 ，所以判断放到create里面去做
  return createReactive(target);
}