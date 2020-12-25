import axios from 'axios'
import store from 'c:/Users/dongwei/Desktop/order1/src/store/index'
const baseURL = process.env.NODE_ENV === 'production' ? '' : '/api'
const instance = axios.create({
  baseURL: baseURL, //请求的域名，基本地址
  timeout: 5000, //请求的超时时长，单位毫秒
  url: '', //请求的路径
  method: 'get，post，put，patch，delete', //请求方法
  headers: {
    token: '' //比如token登录鉴权，请求的时候携带token，让后端识别登录人的信息
  }, //请求头
  params: {}, //请求参数拼接在URL上
  data: {} //请求参数放在请求体里
})

instance.interceptors.request.use(
  function(config) {
    // console.log(config)
    // 在发送请求之前做些什么 设置token 判断有没有token
    if (store.state.token) {
      // console.log(store.state.token)
      config.headers.token = `${store.state.token}`
      // config['headers']['Authorization'] = AUTH_TOKEN
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器  就是对数据做些什么
instance.interceptors.response.use(
  function(response) {
    // console.log(response.data.code)
    // 对响应数据做点什么
    return response
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
// 在传递给 then/catch 前，允许修改响应数据 这里是 判断code的值 来进行操作

export default {
  axios
}
