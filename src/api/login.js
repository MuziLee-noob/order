import request from '@/helpers/request'
let baseUrl = '/api'
// 登录信息
export const loginAuth = params => {
  return request.get(baseUrl + '/login/manageuserlogin', params)
}
// 公司管理
export const companyList = params => {
  return request.post(baseUrl + '/userinfo/companyList', params)
}
// 新建公司
export const companyAdd = params => {
  return request.post(baseUrl + '/userinfo/addCompany', params)
}
// 编辑公司
export const companyEdit = params => {
  return request.post(baseUrl + '/userinfo/editCompany', params)
}
// 查看公司信息
export const companyInfo = params => {
  return request.get(baseUrl + `/userinfo/getCompany?uuid=${params.uuid}`)
}
// 用户管理
export const userList = params => {
  return request.post(baseUrl + '/userinfo/list', params)
}
// 获取公司
export const commanyAll = params => {
  return request.get(baseUrl + '/userinfo/getAllCompany', params)
}
