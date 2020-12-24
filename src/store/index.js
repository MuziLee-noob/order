import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import routes from './modules/routes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters,
  mutations: {},
  actions: {},
  modules: {
    user,
    routes
  }
})
