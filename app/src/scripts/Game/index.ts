export function renderLoop(cb: () => void) {
  requestAnimationFrame(() => renderLoop(cb))
  cb();
}

export function loop(cb: () => void, interval: number) {
  setTimeout(() => loop(cb, interval), interval);
  cb();
}
