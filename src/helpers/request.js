import axios from 'axios'
import store from '@/store'
import { Message, Modal } from 'view-design'
import { getUrlQuery } from '../libs/tools'

const repeatMsg = 'REPEATREQUEST'
const { CancelToken } = axios
let cancelRequest = new Map()

/**
 * prompt function
 * @param {String} msg
 */
const tip = msg => {
  Message.error({
    content: msg,
    duration: 10
  })
}

/**
 * Serialization parameter
 * @param  {Object}    params
 * @return {encode}    encodeURI
 */

function paramsSerializer(params) {
  let result = []
  for (let i in params) {
    let isObject = Object.prototype.hasOwnProperty.call(params, i) && typeof params[i] !== 'string'
    isObject ? result.push(`${i}=${JSON.stringify(params[i])}`) : result.push(`${i}=${params[i]}`)
  }
  return encodeURI(result.join('&'))
}

// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: 'http://2774t6789a.zicp.vip/portalManager',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
  // paramsSerializer: paramsSerializer
})

/**
 * request interceptor
 * @param  {Object} config
 * @return {Object}
 */
request.interceptors.request.use(
  config => {
    // token
    // const token = store.state.user.token
    // const token = getUrlQuery('p') ? getUrlQuery('p') : localStorage.getItem('tokenVal')
    // token && (config.headers['token'] = token)
    // const userId = store.getters && store.getters.userId
    // userId && (config.headers['x-authenticated-userid'] = userId)

    return config
  },
  error => {
    // Do something with request error
    // eslint-disable-next-line
    console.log(error)
    Promise.reject(error)
  }
)

/**
 * response interceptor
 * @param  {Object} response
 * @return {Object}
 */
request.interceptors.response.use(
  response => {
    const code = response.data.status || 0
    const msg = response.data.msg
    // if (code === -1000) {
    //   // token过期
    //   Modal.error({
    //     title: '温馨提示',
    //     // content: msg,
    //     content: '登录状态已过期，请重新登录',
    //     onOk: () => {
    //       // 添加redirectUrl参数
    //       localStorage.clear()
    //       sessionStorage.clear()
    //       const url = process.env.NODE_ENV === 'demo' ? window.demo.admin : window.g.admin
    //       window.location.href = url + '/login?redirectUrl=' + window.location.origin
    //     }
    //   })
    //   return Promise.reject(new Error(msg))
    // } else
    if (code !== 0) {
      // 接口报错
      Modal.error({
        title: '温馨提示',
        content: msg
      })
      return Promise.reject(new Error(msg))
    } else {
      // 响应结果
      return response.data
    }
  },
  error => {
    const { response } = error
    if (response) {
      const { data } = response
      const { error: err } = data
      if (data && err) {
        const { code, message } = err
        // Token expired;
        if (code === 9999) {
          Message.info({
            content: 'Login Timeout',
            duration: 2,
            onClose() {
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            }
          })
        } else {
          const errCodeMap = {
            401: '无数据权限',
            // 404: '资源不存在',
            // 405: '方法不被允许',
            // 429: '请求过于频繁',
            500: '服务器发生错误'
          }
          errCodeMap[code] && tip(message)
        }
        return Promise.reject(err)
      } else {
        const { statusText, status, message } = response
        if (message === repeatMsg) {
          tip('repeat request')
        } else {
          // The request has been issued, but not in the range of 2 xx
          tip(`Status:${status},Message: ${statusText}`)
          return Promise.reject(new Error(response || 'Error'))
        }
      }
    } else {
      // To deal with broken network
      tip(`Broken Network, ${error}`)
      // eslint-disable-next-line
      console.log(`err:${error}`)
    }
  }
)

export default request
