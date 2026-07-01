export function startViewTransition(update) {
  if (typeof document !== 'undefined' && document.startViewTransition) {
    document.startViewTransition(update)
    return
  }
  update()
}
