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
// 获取用户角色
export const roleAll = params => {
  return request.get(baseUrl + '/userinfo/getAllRole', params)
}
// 新建用户
export const userAdd = params => {
  return request.post(baseUrl + '/userinfo/addUser', params)
}
// 编辑用户
export const userEdit = params => {
  return request.post(baseUrl + '/userinfo/editUser', params)
}
// 查看用户信息
export const userInfo = params => {
  return request.get(baseUrl + `/userinfo/getUser?uuid=${params.uuid}`)
}
// 删除用户
export const userDelete = params => {
  return request.post(baseUrl + '/userinfo/deleteUser', params)
}
// 重置密码
export const resetPassword = params => {
  return request.post(baseUrl + '/userinfo/resetPassword', params)
}
// 获取所有用户
export const allUser = params => {
  return request.get(baseUrl + '/userinfo/getAllUser')
}
// 确定分配角色
export const setRole = params => {
  return request.post(baseUrl + '/userinfo/setRole', params)
}
// 获取数据统计工单列表
export const orderStatics = params => {
  return request.get(
    baseUrl +
      `/statistics/orderStatics?startTime=${params.startTime}&&endTime=${params.endTime}&&day=${params.day}`
  )
}
// 全部信息
export const messageList = params => {
  return request.post(baseUrl + '/message/list', params)
}
