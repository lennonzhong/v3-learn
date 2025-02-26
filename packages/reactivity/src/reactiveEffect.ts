import { targetEffect } from "./effect";

function createDep(cleanup, name) {
  let dep = new Map() as any;
  dep.cleanup = cleanup;
  dep.name = name;
  return dep;
}

let targetMap = new WeakMap();
export function track(target, key) {
  if (targetEffect) {
    let depMap = targetMap.get(target);

    if (!depMap) {
      targetMap.set(target, (depMap = new Map()));
    }
    let deps = depMap.get(key);
    if (!deps) {
      depMap.set(key, (deps = createDep(() => {
        depMap.delete(key);
      }, key)))
    }

    trackDep(targetEffect, deps);
    console.log(targetMap);
  }
}

function trackDep(effect, deps) {
  deps.set(effect, effect.effectId)
}