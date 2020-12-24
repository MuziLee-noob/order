import request from '@/helpers/request'
const uas = process.env.NODE_ENV === 'demo' ? window.demo.getWay : window.g.getWay
//建权 - 菜单
export const menuList = params => {
  return request.get(uas + `/uas/sys/menus/permissionByPath?path=${params.path}`, params)
}
