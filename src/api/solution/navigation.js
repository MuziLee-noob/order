import request from '@/helpers/request'
import * as _ from 'lodash'

const baseUrl = process.env.NODE_ENV === 'demo' ? window.demo.getWay : window.g.getWay

/**
 * 获取所有方案列表
 *
 * @returns
 */
const getPlans = async () => {
  const res = await request.get(baseUrl + '/portalManager/solutions/plans')
  if (res && res.results && res.results.length) {
    res.results.forEach(item => {
      item.openTypeString = { 0: '当前窗口', 1: '新建窗口' }[item.openType] // 开打方式(0当前窗口 1新建窗口)
    })
    _.first(res.results).isFirst = true
    _.last(res.results).isLast = true
  }
  return res
}

/**
 * 创建方案
 *
 * @param {Object} data
 * @returns
 */
const addPlans = data => {
  return request.post(baseUrl + '/portalManager/solutions/plans', data)
}

/**
 * 更新方案
 *
 * @param {Object} data
 * @returns
 */
const editPlans = data => {
  return request.patch(baseUrl + '/portalManager/solutions/plans', data)
}

/**
 * 删除方案
 *
 * @param {String} id
 * @returns
 */
const deletePlans = id => {
  return request.delete(baseUrl + '/portalManager/solutions/plans', { params: { id: id } })
}

/**
 * 启用禁用
 * @param {String} opId
 * @param {String} switchs 启用禁用（0正常 1停用）
 * @returns
 */
const switchPlans = (opId, switchs) => {
  const data = { opId: opId, switchs: String(switchs) }
  return request.patch(baseUrl + '/portalManager/solutions/plans/switches ', data)
}

/**
 *上移下移 - 方案
 *
 * @param {String} opId 操作id
 * @param {String} fluctuation 0正常 1停用
 * @returns
 */
const movePlans = (opId, fluctuation) => {
  const data = { fluctuation: String(fluctuation), opId: opId }
  return request.patch(baseUrl + '/portalManager/solutions/plans/moves', data)
}

export { getPlans, addPlans, editPlans, deletePlans, switchPlans, movePlans }
