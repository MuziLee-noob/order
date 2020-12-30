import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import routes from './modules/routes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    role: 2,
    userUuid: ''
  },
  getters,
  mutations: {
    login: (state, data) => {
      state.token = data
      localStorage.setItem('token',data);
    },
    setRole(state,data){
      state.role=data;
    },
    setUserUuid(state,data){
      state.userUuid=data;
    }
  },
  actions: {},
  modules: {
    user,
    routes
  }
})
