import request from '@/helpers/request'

const baseUrl = process.env.NODE_ENV === 'demo' ? window.demo.getWay : window.g.getWay
// let baseUrl = 'http://ofsrvoperationmanager.project.dev.ict.cmcc'
//
// let baseUrl_1 = 'http://ofsrvloginauth.project.dev.ict.cmcc'
// 获取用户信息
export const getUserInfo = params => {
  return request.post(baseUrl + '/loginAuth/user/tokenVerify', params)
}
// 策略监控 - 用户策略
export const userPolicyList = params => {
  return request.get(
    baseUrl +
      `/om/events/users?eventStartTime=${params.eventStartTime}&&eventEndTime=${params.eventEndTime}&&userAccount=${params.userAccount}&&userName=${params.userName}&&userRole=${params.userRole}&&coName=${params.coName}&&coAddressPcdCode=${params.coAddressPcdCode}&&coAddressPcdName=${params.coAddressPcdName}&&ip=${params.ip}&&size=${params.size}&&current=${params.current}`
  )
}
//获取下拉框 公共
export const commenSelect = params => {
  return request.get(baseUrl + `/om/comm/dict/details/list?dictCode=${params.dictCode}`, params)
}
// 策略监控 - 应用策略
export const applyPolicyList = params => {
  return request.get(
    baseUrl +
      `/om/events/apps?eventStartTime=${params.eventStartTime}&&eventEndTime=${params.eventEndTime}&&appId=${params.appId}&&appName=${params.appName}&&appType=${params.appType}&&coName=${params.coName}&&size=${params.size}&&current=${params.current}`
  )
}
// 策略监控 - api策略
export const apiPolicyList = params => {
  return request.get(
    baseUrl +
      `/om/events/apis?eventStartTime=${params.eventStartTime}&&eventEndTime=${params.eventEndTime}&&apiGroupId=${params.apiGroupId}&&apiGroupName=${params.apiGroupName}&&serviceStatus=${params.serviceStatus}&&serviceType=${params.serviceType}&&apiIp=${params.apiIp}&&apiPort=${params.apiPort}&&size=${params.size}&&current=${params.current}`
  )
}

// 策略配置 - 用户策略
export const apiConfigList = params => {
  return request.get(
    baseUrl +
      `/om/policies?startTime=${params.eventStartTime}&&endTime=${params.eventEndTime}&&policyScopeCode=${params.policyScopeCode}&&policyDetailCode=${params.policyDetailCode}&&policyName=${params.policyName}&&policyValue=${params.policyValue}&&policyTypeCode=${params.policyTypeCode}&&size=${params.size}&&current=${params.current}`
  )
}
// 策略配置 - 创建策略
export const apiConfigCreate = params => {
  return request.post(baseUrl + '/om/policies', params)
}
// 策略配置 - 通过策略类型获取opId
export const apiConfigInit = params => {
  return request.get(baseUrl + `/om/policy/defs/type/${params.key}`)
}
// 策略配置 - 通过opId获取策略对象
export const apiConfigObject = params => {
  return request.get(baseUrl + `/om/policy/defs/${params.opId}`)
}
//策略配置 - 初始化管理
export const configInit = params => {
  return request.get(baseUrl + `/om/policies/${params.opId}`, params)
}
//策略配置 - 更新管理
export const configEditOk = params => {
  return request.put(baseUrl + `/om/policies/${params.opId}`, params)
}
// 策略配置 - 删除策略
export const apiConfigDelete = params => {
  let url = baseUrl + `/om/policies/${params.opId}`
  delete params.opId
  return request.delete(url, { params: params })
}
// 策略配置 - 启用禁用
export const apiConfigSwith = params => {
  return request.patch(baseUrl + `/om/policies/switches`, params)
}

// 策略配置 - 高级配置 - 列表
export const highCofigList = params => {
  return request.get(
    baseUrl + `/om/policy/configs?&&current=${params.current}&&size=${params.size}`
  )
}
// 策略配置 - 高级配置 - 删除
export const highConfigDel = params => {
  return request.delete(baseUrl + `/om/policy/configs/${params.opId}`, params)
}
//策略配置 - 高级配置  - 启用禁用
export const highConfigSwith = params => {
  return request.patch(baseUrl + `/om/policy/configs/switches`, params)
}
//策略配置 - 高级配置 - 管理下拉框
export const highConfgiSelect = params => {
  return request.get(baseUrl + `/om/policy/configs/units/${params.opId}`, params)
}
//策略配置 - 高级配置 - 初始化管理
export const initHigh = params => {
  return request.get(baseUrl + `/om/policy/configs/${params.opId}`, params)
}
//策略配置 - 高级配置 - 确定管理
export const highManage = params => {
  return request.put(baseUrl + `/om/policy/configs/${params.opId}`, params)
}
