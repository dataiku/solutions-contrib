export function stop (e) {
    e.stopPropagation()
}
  
export function prevent (e) {
  e.cancelable !== false && e.preventDefault()
}
  
export function stopAndPrevent (e) {
  e.cancelable !== false && e.preventDefault()
  e.stopPropagation()
}
  