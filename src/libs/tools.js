// 时间转化方法
const dateFormat = function(fmt, date) {
  if (date === null || date === undefined || date === '') {
    return ''
  }

  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
  }

  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  }

  return fmt
}
// 时间戳转化方法
const timeConvert = function(timestamp, num) {
  // num:0 YYYY-MM-DD
  // num:1 YYYY-MM-DD hh:mm:ss
  // timestamp:时间戳
  timestamp = timestamp + ''
  timestamp = timestamp.length === 10 ? timestamp * 1000 : timestamp
  var date = new Date(timestamp)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  var h = date.getHours()
  h = h < 10 ? '0' + h : h
  var minute = date.getMinutes()
  var second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  if (num === 0) {
    return y + '-' + m + '-' + d
  } else {
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  }
}
// 过滤空值属性
const filterNull = function(params) {
  for (let key in params) {
    if (params[key] instanceof Object) {
      filterNull(params[key])
    } else if (params[key] === null || params[key] === undefined || params[key] === '') {
      delete params[key]
    }
  }
  return params
}
// 获取url参数
const getUrlQuery = function(name) {
  const url = window.location.href
  const params = url.substring(url.indexOf('?'))
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = params.substr(1).match(reg)
  if (r !== null) return unescape(r[2])
  return null
}
module.exports = {
  timeConvert, // 时间戳转化方法
  filterNull,
  getUrlQuery,
  dateFormat // 时间转化方法
}
