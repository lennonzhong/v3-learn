import { targetEffect } from "./effect";
export function track(target, key) {
  if (targetEffect) {
    console.log(target, key, targetEffect);
  }
}