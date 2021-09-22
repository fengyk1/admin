const prefix = 'admin'
export function getStorage(key){
  return localStorage.getItem(`${prefix}-${key}`)
}
export function setStorage(key,value){
  return localStorage.setItem(`${prefix}-${key}`,value)
}
