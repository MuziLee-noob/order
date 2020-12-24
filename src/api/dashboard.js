import request from '@/helpers/request'
const base = process.env.NODE_ENV === 'demo' ? window.demo.getWay : window.g.getWay
export const getSysLogCountApi = () => {
  return request.get(base + '/sys/logs/count')
}
