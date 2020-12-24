import request from '@/helpers/request'
// 登录信息
export const loginAuth = params => {
  return request.get(`login/manageuserlogin?account=${params.account}&pwd=${params.pwd}`)
}
