import { getLocalstorage, removeLocalstorage, setLocalstorage } from '@/utils/index'

const TokenKey = localStorage.getItem('tokenVal')

export function getToken() {
  return getLocalstorage(TokenKey)
}

export function setToken(token) {
  return setLocalstorage(TokenKey, token)
}

export function removeToken() {
  return removeLocalstorage(TokenKey)
}
