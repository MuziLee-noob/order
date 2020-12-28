import request from '@/helpers/request'
let baseUrl = '/api'
// 登录信息
export const loginAuth = params => {
  return request.get(baseUrl + `/login/manageuserlogin?account=${params.account}&pwd=${params.pwd}`)
}
