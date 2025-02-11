import { track } from "./reactiveEffect";
// 已经是响应式的对象再次reactive不做处理, 如何判断是否是已经代理过的对象？ 答：通过特殊的key判断
export enum ReactiveFlag {
  IS_REACTIVE = "__v_isReactive"
}


export const handlers: ProxyHandler<object> = {
  get(target, key, receiver) {
    if (key === ReactiveFlag.IS_REACTIVE) {
      return true;
    }
    // todo 依赖收集
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {

    // 出发更新
    return Reflect.set(target, key, value, receiver);
  }
}
