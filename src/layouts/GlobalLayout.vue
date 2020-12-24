<template>
  <i-layout class="global-layout">
    <i-sider
      :collapsed-width="64"
      :width="213"
      class="global-layout__sider"
      collapsible
      hide-trigger
      v-model="isCollapsed"
    >
      <SideMenu
        :accordion="true"
        :active-name="$route.name"
        :collapsed="isCollapsed"
        :menu-list="menuList"
        @on-select="turnToPage"
        theme="dark"
        v-if="reFresh"
      >
        <div class="layout-logo">
          <router-link to="/">
            <!-- <span class="oneFusion">OneFusion</span>global-layout__logo -->
            <!-- <img class="layout-logo__img" src="~@/assets/images/logo.svg" /> -->
            <!-- <h1 v-show="!isCollapsed" class="layout-logo__title">{{ shortSiteName }}</h1> -->
          </router-link>
        </div>
        <!-- <div class="global-layout-title">
          工单系统
        </div> -->
      </SideMenu>
    </i-sider>
    <i-layout
      :class="[
        'global-layout__containers',
        this.isCollapsed ? 'global-layout__containers_expand-width' : ''
      ]"
    >
      <i-header
        :class="[
          'global-layout__header',
          this.isCollapsed ? 'global-layout__header_expand-width' : ''
        ]"
      >
        <GlobalHeader :is-collapsed="isCollapsed" @toggleCollapse="toggleCollapse" />
      </i-header>
      <i-content class="global-layout__content" style="background: #f5f5f5">
        <slot></slot>
      </i-content>
    </i-layout>
  </i-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyright, shortSiteName } from '@/config'
import SideMenu from '@/components/SideMenu'
import GlobalHeader from './GlobalHeader'
import { getMenuList } from '@/helpers/router'
import { menuList } from '@/api/common'
import { getUrlQuery } from '../libs/tools'
export default {
  name: 'GlobalLayout',

  components: {
    SideMenu,
    GlobalHeader
  },

  filters: {},

  props: {},

  data() {
    return {
      isCollapsed: false,
      shortSiteName: shortSiteName,
      copyright: copyright,
      // menuList: [],
      reFresh: true
    }
  },

  computed: {
    ...mapGetters(['routes']),

    menuList() {
      const routes = this.routes
      const menuList = getMenuList(routes)
      // const arr = []
      //条件筛选目录
      // menuList.forEach((data, ind) => {
      //   if (data.show === this.$store.state.user.menu) {
      //     arr.push(data)
      //   }
      // })
      return menuList
    }
  },

  // watch: {
  //   menuList(arr) {
  //     console.log(arr)
  //     this.reFresh = false
  //     this.$nextTick(() => {
  //       this.reFresh = true
  //     })
  //   }
  // },

  created() {
    // this.limitMenuList()
  },

  mounted() {},

  updated() {},

  activated() {},

  deactivated() {},

  destroyed() {},

  methods: {
    // limitMenuList() {
    //   let token = getUrlQuery('p') ? getUrlQuery('p') : localStorage.getItem('tokenVal')
    //   localStorage.setItem('tokenVal', token)
    //   const productUrl = process.env.NODE_ENV === 'demo' ? window.demo.product : window.g.product
    //   let params = {
    //     path: productUrl
    //   }
    //   menuList(params).then(res => {
    //     if (res.status === 0) {
    //       localStorage.removeItem('btnLimit')
    //       let obj = {}
    //       let object = {}
    //       let btnLimit = []
    //       res.results.forEach((data, ind) => {
    //         if (data.children[0].menuType === '2') {
    //           obj = {
    //             title: data.menuName,
    //             name: data.menuUrl,
    //             icon: data.menuIcoName,
    //             children: []
    //           }
    //           data.children.forEach((item, index) => {
    //             object = {
    //               title: item.menuName,
    //               name: item.menuUrl,
    //               icon: item.menuIcoName,
    //               children: []
    //             }
    //             let val = {
    //               name: item.menuUrl,
    //               children: item.children
    //             }
    //             obj.children.push(object)
    //             btnLimit.push(val)
    //           })
    //         } else {
    //           obj = {
    //             title: '',
    //             name: data.menuUrl,
    //             icon: '',
    //             children: [
    //               {
    //                 icon: data.menuIcoName,
    //                 name: data.menuUrl,
    //                 title: data.menuName,
    //                 opId: data.opId,
    //                 children: []
    //               }
    //             ]
    //           }
    //           let val = {
    //             name: data.menuUrl,
    //             children: data.children
    //           }
    //           btnLimit.push(val)
    //         }
    //         this.menuList.push(obj)
    //       })
    //       this.menuList.reverse()
    //       if (getUrlQuery('p')) {
    //         this.$router.push(`${this.menuList[0].children[0].name}`)
    //       }
    //       localStorage.setItem('btnLimit', JSON.stringify(btnLimit))
    //     }
    //   })
    // },
    getUrlValue(data, key) {
      let _reg = new RegExp('(^|;)' + key + '=([^;]*)(;|$)', 'i'),
        _r = data.match(_reg)
      if (_r != null) {
        return _r[2]
      }
      return null
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    turnToPage(routeName) {
      let isLink = routeName.indexOf('isTurnByHref_') !== -1
      if (isLink) {
        window.open(routeName.split('_')[1])
        return
      }
      this.$router.push({ name: routeName })
    }
  }
}
</script>

<style lang="less">
.global-layout {
  &__sider {
    &.ivu-layout-sider {
      position: fixed;
      min-height: 100%;
      z-index: 9;
    }
  }

  &__logo {
    height: 59px;
    line-height: 59px;
    text-align: center;
    background-color: #192b6f;
    background-image: url('../assets/icons/logo.svg');
    background-repeat: no-repeat;
    background-size: 30px auto;
    background-position: 30px 15px;
    text-indent: 45px;
  }

  &__containers {
    min-height: 100vh;
    padding-left: 214px;
    background: #fff;

    .ivu-layout-header {
      height: 59px;
      background: #077af0 !important;
      // line-height: 59px;
    }

    &_expand-width {
      padding-left: 64px;
    }
  }

  &__header {
    width: 100%;
    position: fixed;
    top: 0;
    right: 0;
    width: calc(100% - 213px);
    z-index: 1024;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    transition: width 0.2s ease-in-out;

    &_expand-width {
      width: calc(100% - 64px);
    }
  }

  &__content {
    // margin: 88px 24px 0px;
    margin: 59px 0 0 0;
  }

  &__footer {
    text-align: center;
  }
}

.layout-logo {
  height: 59px;
  background: #077af0;
  line-height: 59px;
  padding-left: 22px;
  &__title {
    padding-left: 20px;
    box-sizing: border-box;
    font-size: 19px;
    font-weight: 600;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
    text-transform: uppercase;
    color: #1890ff;
  }

  &__img {
    height: 33px;
    vertical-align: middle;
  }
}

.global-layout-title {
  font-size: 18px;
  color: #fff;
  height: 56px;
  margin: 0 10px 21px 12px;
  padding-top: 18px;
  position: relative;
  text-align: center;
  border-bottom: 1px solid #25405c;
}
.oneFusion {
  font-size: 21px;
  font-weight: bold;
  color: #fff;
}
</style>
