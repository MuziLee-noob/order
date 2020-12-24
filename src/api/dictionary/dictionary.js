import request from '@/helpers/request'
import { filterNull } from '../../libs/tools'

const baseUrl = process.env.NODE_ENV === 'demo' ? window.demo.getWay : window.g.getWay

// 字典管理列表
export const dictionaryList = params => {
  let url = baseUrl + `/om/comm/dict/masters`
  return request.get(url, { params: filterNull(params) })
}
//创建字典管理
export const dictionaryCreate = params => {
  return request.post(baseUrl + '/om/comm/dict/masters', filterNull(params))
}
// 字典类型 - 获取下拉框数据
export const dictionarySelect = params => {
  return request.get(baseUrl + `/om/comm/dict/details/list?dictCode=${params.dictCode}`)
}
//编辑字典管理
export const dictionaryEdit = params => {
  return request.put(baseUrl + `/om/comm/dict/masters/${params.opId}`, filterNull(params))
}
// 初始化字典管理
export const dictionaryInit = params => {
  return request.get(baseUrl + `/om/comm/dict/masters/${params.opId}`, params)
}
// 删除字典管理
export const dictionaryDelete = params => {
  let url = baseUrl + `/om/comm/dict/masters/${params.opId}`
  delete params.opId
  return request.delete(url, { params: params })
}

// 字典项管理列表
export const detailsList = params => {
  let url = baseUrl + `/om/comm/dict/details`
  return request.get(url, { params: filterNull(params) })
}
//创建字典项管理
export const detailsCreate = params => {
  return request.post(baseUrl + '/om/comm/dict/details', filterNull(params))
}
//编辑字典项管理
export const detailsEdit = params => {
  return request.put(baseUrl + `/om/comm/dict/details/${params.opId}`, filterNull(params))
}
// 初始化字典项管理
export const detailsInit = params => {
  return request.get(baseUrl + `/om/comm/dict/details/${params.opId}`, params)
}
// 删除字典项管理
export const detailsyDelete = params => {
  let url = baseUrl + `/om/comm/dict/details/${params.opId}`
  delete params.opId
  return request.delete(url, params)
}
