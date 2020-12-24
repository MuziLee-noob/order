import request from '@/helpers/request'
import * as _ from 'lodash'
import { win } from 'leaflet/src/core/Browser'

const baseUrl = process.env.NODE_ENV === 'demo' ? window.demo.getWay : window.g.getWay

/**
 * 获取所有分类列表
 *
 * @returns
 */
const queryClass = async () => {
  const res = await request.get(baseUrl + '/portalManager/solutions/classifications')
  if (res && res.results && res.results.length) {
    let defaultClass = res.results.find(it => it.classifyName == '无')
    defaultClass && (defaultClass.isDefault = true)
    _.first(res.results).isFirst = true
    _.last(res.results).isLast = true
  }
  return res
}

/**
 * 创建分类
 *
 * @param {Object} data
 * @returns
 */
const addClass = data => {
  return request.post(baseUrl + '/portalManager/solutions/classifications', data)
}

/**
 * 删除分类
 *
 * @param {String} id
 * @returns
 */
const deleteClass = id => {
  return request.delete(baseUrl + '/portalManager/solutions/classifications', {
    params: { id: id }
  })
}

/**
 * 更新分类
 *
 * @param {Object} data
 * @returns
 */
const updateClass = data => {
  return request.patch(baseUrl + '/portalManager/solutions/classifications', data)
}

/**
 *上移下移 - 分类
 *
 * @param {String} opId 操作id
 * @param {String} fluctuation 0正常 1停用
 * @returns
 */
const moveClass = (opId, fluctuation) => {
  const data = { fluctuation: String(fluctuation), opId: opId }
  return request.patch(baseUrl + '/portalManager/solutions/classifications/moves', data)
}

/**
 * 启用禁用 - 分类
 *
 * @param {String} opId
 * @param {String} switchs 启用禁用（0正常 1停用）
 * @returns
 */
const switchClass = (opId, switchs) => {
  const data = { opId: opId, switchs: String(switchs) }
  return request.patch(baseUrl + '/portalManager/solutions/classifications/switches', data)
}

/**
 * 判断分类下是否有启用的方案
 *
 * @param {String} classificationsId
 * @returns
 */
const enabledSchema = classificationsId => {
  return request.get(baseUrl + '/portalManager/solutions/classifications/enabledSchema', {
    params: { classificationsId: classificationsId }
  })
}

export { queryClass, addClass, deleteClass, updateClass, moveClass, switchClass, enabledSchema }
