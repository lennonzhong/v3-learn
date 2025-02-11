export let targetEffect;

export function effect(fn, options?) {
  let __effect = new ReactiveEffect(fn, () => {
    __effect.run();
  });

  __effect.run();
}

class ReactiveEffect {
  active: true
  constructor(public fn, public scheduler) { }
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
}