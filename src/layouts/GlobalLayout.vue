<template>
  <i-layout class="global-layout">
    <i-header
      :class="[
        'global-layout__header',
        this.isCollapsed ? 'global-layout__header_expand-width' : ''
      ]"
    >
      <GlobalHeader :is-collapsed="isCollapsed" @toggleCollapse="toggleCollapse" />
    </i-header>
    <i-layout
      :class="[
        'global-layout__containers',
        this.isCollapsed ? 'global-layout__containers_expand-width' : '',
        { 'hide-frame': $route.meta && $route.meta.hideFrame }
      ]"
    >
      <i-sider
        v-if="!($route.meta && $route.meta.hideFrame)"
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
          v-if="reFresh"
        >
          <div class="layout-logo">
            <router-link to="/">
              <!-- <span class="oneFusion">武分派单系统</span> -->
              <!-- <img src="../assets/images/编组2.png" /> -->
              <!-- <h1 v-show="!isCollapsed" class="layout-logo__title">11</h1> -->
            </router-link>
          </div>
          <!-- <div class="global-layout-title">
          工单系统
        </div> -->
        </SideMenu>
      </i-sider>
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
      const arr = []
      //条件筛选目录
      menuList.forEach((data, ind) => {
        if (data.show && data.show !== '') {
          //控制新建工单
          if (data.show === this.$store.state.user.auditCreat) {
            let array = {
              title: data.title,
              show: data.show,
              other: data.other,
              name: data.name,
              icon: data.icon,
              children: []
            }
            arr.push(array)
            if (data.children && data.children.length > 0) {
              data.children.forEach((val, index) => {
                if (val.show && val.show !== '') {
                  if (val.show === this.$store.state.user.auditCreat) {
                    arr[ind].children.push(val)
                  }
                } else if (val.other && val.other !== '') {
                  if (val.other === this.$store.state.user.auditOther) {
                    arr[ind].children.push(val)
                  }
                } else {
                  arr[ind].children.push(val)
                }
              })
            }
          }
        } else if (data.other && data.other !== '') {
          //控制除新建，代办和已办其他页面
          if (data.other === this.$store.state.user.auditOther) {
            let array = {
              title: data.title,
              show: data.show,
              other: data.other,
              name: data.name,
              icon: data.icon,
              children: []
            }
            arr.push(array)
            if (data.children && data.children.length > 0) {
              data.children.forEach((val, index) => {
                if (val.show && val.show !== '') {
                  if (val.show === this.$store.state.user.auditCreat) {
                    arr[ind].children.push(val)
                  }
                } else if (val.other && val.other !== '') {
                  if (val.other === this.$store.state.user.auditOther) {
                    arr[ind].children.push(val)
                  }
                } else {
                  arr[ind].children.push(val)
                }
              })
            }
          }
        } else {
          let array = {
            title: data.title,
            name: data.name,
            icon: data.icon,
            children: []
          }
          arr.push(array)
          if (data.children && data.children.length > 0) {
            data.children.forEach((val, index) => {
              if (val.show && val.show !== '') {
                if (val.show === this.$store.state.user.auditCreat) {
                  arr[ind].children.push(val)
                }
              } else if (val.other && val.other !== '') {
                if (val.other === this.$store.state.user.auditOther) {
                  arr[ind].children.push(val)
                }
              } else {
                arr[ind].children.push(val)
              }
            })
          }
        }
      })
      // menuList.forEach((data, ind) => {
      //   debugger
      //   if (data.show) {
      //     //控制新建工单
      //     if (data.show === this.$store.state.user.auditCreat) {
      //       let array = {
      //         title: data.title,
      //         show: data.show,
      //         name: data.name,
      //         icon: data.icon,
      //         children: []
      //       }
      //       arr.push(array)
      //       if (data.children && data.children.length > 0) {
      //         data.children.forEach((val, index) => {
      //           if (val.show || val.show === '') {
      //             if (val.show === this.$store.state.user.auditCreat) {
      //               arr[ind].children.push(val)
      //             }
      //           } else if (val.other || val.other === '') {
      //             if (val.other === this.$store.state.user.auditOther) {
      //               arr[ind].children.push(val)
      //             }
      //           } else {
      //             arr[ind].children.push(val)
      //           }
      //         })
      //       }
      //     }
      //   } else if (data.other) {
      //     //控制除新建，代办和已办其他页面
      //     if (data.other === this.$store.state.user.auditOther) {
      //       let array = {
      //         title: data.title,
      //         other: data.other,
      //         name: data.name,
      //         icon: data.icon,
      //         children: []
      //       }
      //       arr.push(array)
      //       if (data.children && data.children.length > 0) {
      //         data.children.forEach((val, index) => {
      //           if (val.show || val.show === '') {
      //             if (val.show === this.$store.state.user.auditCreat) {
      //               arr[ind].children.push(val)
      //             }
      //           } else if (val.other || val.other === '') {
      //             if (val.other === this.$store.state.user.auditOther) {
      //               arr[ind].children.push(val)
      //             }
      //           } else {
      //             arr[ind].children.push(val)
      //           }
      //         })
      //       }
      //     }
      //   } else {
      //     let array = {
      //       title: data.title,
      //       name: data.name,
      //       icon: data.icon,
      //       children: []
      //     }
      //     arr.push(array)
      //     if (data.children && data.children.length > 0) {
      //       data.children.forEach((val, index) => {
      //         if (val.show || val.show === '') {
      //           if (val.show === this.$store.state.user.auditCreat) {
      //             arr[ind].children.push(val)
      //           }
      //         } else if (val.other || val.other === '') {
      //           if (val.other === this.$store.state.user.auditOther) {
      //             arr[ind].children.push(val)
      //           }
      //         } else {
      //           arr[ind].children.push(val)
      //         }
      //       })
      //     }
      //   }
      // })
      // console.log(arr)
      return arr
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
@header-h: 59px;
.global-layout {
  &__sider {
    &.ivu-layout-sider {
      position: fixed;
      min-height: 100vh;
      z-index: 9;
      margin-top: @header-h;
    }
  }
  .ivu-layout-header {
    height: @header-h;
    line-height: @header-h;
  }
  &__containers {
    min-height: 100vh;
    // padding-left: 231px;
    // padding-left: 214px;
    background: #fff;

    &_expand-width {
      padding-left: 64px;
    }
    &.hide-frame {
      .global-layout__content {
        margin-left: 0;
      }
    }
  }

  &__header {
    width: 100%;
    position: fixed;
    top: 0;
    right: 0;
    // width: calc(100% - 213px);
    z-index: 999;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    transition: width 0.2s ease-in-out;

    &_expand-width {
      width: calc(100% - 64px);
    }
  }

  &__content {
    // margin: 88px 24px 0px;
    margin: @header-h 0 0 213px;
  }

  &__footer {
    text-align: center;
  }
}

.global-layout-title {
  font-size: 18px;
  color: #fff;
  height: 68px;
  line-height: 60px;
  position: relative;
  text-align: center;

  i {
    position: absolute;
    bottom: 10px;
    left: 12px;
    width: 190px;
    height: 1px;
    border-bottom: 1px solid #25405c;
  }
}
</style>
