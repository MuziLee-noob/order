import request from '@/helpers/request'

let baseUrl =
  process.env.NODE_ENV === 'demo'
    ? `${window.demo.getWay}/portalManager`
    : `${window.g.getWay}/portalManager`

// 快速导航列表
export const quickNavList = params => {
  return request.get(baseUrl + '/doc/quick-navis', { params: params })
}
// 快速导航列表删除
export const quickNavDelete = params => {
  let url = baseUrl + `/doc/quick-navis/${params.opId}`
  delete params.opId
  return request.delete(url, { params: params })
}
//快速导航上移下移
export const quickNavListSort = params => {
  return request.patch(baseUrl + '/doc/quick-navis/sort', params)
}
//快速导航列表启用禁用
export const quickSwith = params => {
  return request.patch(baseUrl + '/doc/quick-navis/display', params)
}
// 快速导航初始化信息
export const quickNavInfo = params => {
  let url = baseUrl + `/doc/quick-navis/${params.opId}`
  delete params.opId
  return request.get(url, params)
}
//创建快速导航
export const quickNavAddList = params => {
  return request.post(baseUrl + '/doc/quick-navis', params)
}
//编辑快速导航
export const quickNavEditList = params => {
  let url = baseUrl + `/doc/quick-navis`
  return request.put(url, params)
}

// 文档导航列表
export const proTableList = params => {
  return request.get(baseUrl + '/doc/navi', { params: params })
}
// 文档导航列表删除
export const proListDelete = params => {
  let url = baseUrl + `/doc/navi/${params.opId}`
  delete params.opId
  return request.delete(url, { params: params })
}
// 文档导航列表上移下移
export const proListSort = params => {
  return request.patch(baseUrl + '/doc/navi/sort', params)
}
// 文档导航列表禁用启用
export const proListSwitchs = params => {
  return request.patch(baseUrl + '/doc/navi/display', params)
}
// 文档导航初始化信息
export const proListInfo = params => {
  let url = baseUrl + `/doc/navi/${params.opId}`
  delete params.opId
  return request.get(url, params)
}
//创建文档导航
export const proCreate = params => {
  return request.post(baseUrl + '/doc/navi', params)
}
//编辑文档导航
export const proEdit = params => {
  let url = baseUrl + `/doc/navi`
  return request.put(url, params)
}
