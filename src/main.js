import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import utils from './utils'
import ViewUI from 'view-design'
import Clipboard from 'v-clipboard'
import permission from '@/directive/permission'
import permissionHelper from './helpers/permission'
import request from './helpers/request'
import modal from './helpers/modal'
// 分页控件
import Pagination from '@/components/page/pagination'
// 中国地区
import VDistpicker from 'v-distpicker'
import '@/themes/common.less'
import '@/themes/iview-theme.less'
import '@/assets/icons'
import '@/assets/fonts/iconfont.css'
import '@/permission'
/* Import styles */
// import '@/assets/icons/iconfont.js'
/* Register component */

Vue.use(ViewUI)

Vue.component('Pagination', Pagination)
Vue.component('v-distpicker', VDistpicker)
/* Register directive */

Vue.use(Clipboard)
Vue.use(permission)
Vue.use(modal)

/* Use plugins */

Vue.prototype.$utils = utils
Vue.prototype.$http = request
Vue.prototype.$permission = permissionHelper

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
/* permission control */

/* Config */

Vue.config.productionTip = false
Vue.config.performance = process.env.NODE_ENV === 'development'

/* Initial */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
