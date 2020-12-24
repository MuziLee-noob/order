import request from '@/helpers/request'

// let baseUrl = 'http://ofsrvoperationmanager.project.dev.ict.cmcc'
const baseUrl = process.env.NODE_ENV === 'demo' ? window.demo.getWay : window.g.getWay
// import { filterNull } from '../../libs/tools'

//日志管理 - 查询审计 - 列表
export const logList = params => {
  return request.get(
    baseUrl +
      // `/om/logs?startTime=${params.startTime}&&endTime=${params.endTime}&&indexName=${params.indexName}&&current=${params.current}&&size=${params.size}`
      `/om/logs?current=${params.current}&&size=${params.size}&&esIndex=${params.esIndex}&&ip=${params.ip}&&logDetail=${params.logDetail}`
  )
}

//日志管理 - 日志配置 - 采集策略 - 列表
export const logCollectList = params => {
  return request.get(
    baseUrl +
      `/om/log/coll/policies?startTime=${params.startTime}&&endTime=${params.endTime}&&indexName=${params.indexName}&&current=${params.current}&&size=${params.size}`
  )
}
//日志管理 - 日志配置 - 采集策略 - 创建
export const logCollectCreat = params => {
  return request.post(baseUrl + '/om/log/coll/policies', params)
}
//日志管理 - 日志配置 - 采集策略 - 初始化管理
export const logCollectInit = params => {
  return request.get(baseUrl + `/om/log/coll/policies/${params.opId}`, params)
}
//日志管理 - 日志配置 - 采集策略 - 更新管理
export const logCollectEdit = params => {
  return request.put(baseUrl + `/om/log/coll/policies/${params.opId}`, params)
}
//日志管理 - 日志配置 - 采集策略 - 列表删除
export const logCollectDel = params => {
  return request.delete(baseUrl + `/om/log/coll/policies/${params.opId}`, params)
}
//日志管理 - 日志配置 - 采集策略 - 启用禁用
export const logCollectSwith = params => {
  return request.patch(baseUrl + `/om/log/coll/policies/switches`, params)
}

//日志管理 - 日志配置 - 删除策略 - 列表
export const logDelList = params => {
  return request.get(
    baseUrl +
      `/om/log/del-policies?indexName=${params.indexName}&&current=${params.current}&&size=${params.size}`
  )
}
//日志管理 - 日志配置 - 删除策略 - 管理
export const delManage = params => {
  return request.put(baseUrl + `/om/log/del-policies/${params.opId}`, params)
}
//日志管理 - 日志配置 - 删除策略 - 删除
export const delLog = params => {
  return request.delete(baseUrl + `/om/log/del-policies/${params.opId}`, params)
}
//日志管理 - 日志配置 - 删除策略 - 启用禁用
export const delLogSwith = params => {
  return request.patch(baseUrl + `/om/log/del-policies/switches`, params)
}

//日志管理 - 日志配置 -  高级配置- 列表
export const logCofigList = params => {
  return request.get(baseUrl + `/om/log/configs?&&current=${params.current}&&size=${params.size}`)
}
//策略配置 - 高级配置 - 初始化管理
export const initHigh = params => {
  return request.get(baseUrl + `/om/log/configs/${params.opId}`, params)
}
//日志管理 - 日志配置 - 高级配置 - 管理
export const highManage = params => {
  return request.put(baseUrl + `/om/log/configs/${params.opId}`, params)
}
//日志管理 - 日志配置 - 高级配置 - 删除
export const highLog = params => {
  return request.delete(baseUrl + `/om/log/configs/${params.opId}`, params)
}
//日志管理 - 日志配置 - 高级配置 - 启用禁用
export const highLogSwith = params => {
  return request.patch(baseUrl + `/om/log/configs/switches`, params)
}
//日志管理 - 日志配置 - 高级配置 - 管理下拉框
export const highLogSelect = params => {
  return request.get(baseUrl + `/om/log/configs/units/${params.opId}`, params)
}
