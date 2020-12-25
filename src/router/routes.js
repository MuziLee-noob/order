import MainView from '@/layouts/MainView'
// import RouteView from '@/layouts/RouteView'

/**
 * configurable parameters under the routing '/'
 * hidden: true                        if `hidden:true` will not show in the sidebar, default is false
 * name:'router-name'                  must set and globally unique
 * meta : {
    auths: ['super_admin','admin']     set multiple roles, default is null
    title: 'title'                     the name show in submenu and breadcrumb, must set
    icon: 'icon-name'                  the icon show in the sidebar, must set
    href: 'url'                        redirect url
  }
 **/

export const constantRoutes = [
  {
    path: '/',
    redirect: { name: 'Login' },
    hidden: true
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/pages/login/login'),
    meta: { title: '登录' },
    hidden: true
  },
  {
    path: '/redirect',
    component: MainView,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import(/* webpackChunkName: "layouts-redirect" */ '@/layouts/Redirect')
      }
    ]
  }
]

export const asyncRoutes = [
  // {
  //   path: '/',
  //   name: 'set',
  //   component: MainView,
  //   meta: {
  //     hideInBread: true,
  //     title: '个人设置',
  //     hideFrame: true
  //   },
  //   children: [
  //     {
  //       path: '/setting',
  //       name: 'setting',
  //       meta: {
  //         title: '设置',
  //         hideFrame: true,
  //         hideInBread: false
  //       },
  //       component: () => import('@/pages/setting/index')
  //     }
  //   ]
  // },
  // {
  //   path: '/',
  //   name: 'infomation',
  //   component: MainView,
  //   children: [
  //     {
  //       path: '/info',
  //       name: 'info',
  //       meta: {
  //         title: '消息',
  //         hideFrame: true,
  //         hideInBread: false
  //       },
  //       component: () => import('@/pages/setting/info.vue')
  //     }
  //   ]
  // },
  {
    path: '/',
    name: 'order',
    component: MainView,
    meta: {
      hideInBread: true,
      title: '工单管理',
      icon: 'policy'
    },
    children: [
      {
        path: '/pedding',
        name: 'pedding',
        meta: {
          title: '待办工单'
        },
        component: () => import('@/pages/order/peddingOrder.vue')
      },
      {
        path: '/details',
        name: 'details',
        hidden: true,
        meta: {
          title: '工单详情',
          hideInBread: false
        },
        component: () => import('@/pages/order/details.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        hideInBread: true,
        hidden: true,
        meta: {
          title: '设置',
          hideFrame: true,
          hideInBread: false
        },
        component: () => import('@/pages/setting/index')
      },
      {
        path: '/info',
        name: 'info',
        hideInBread: true,
        hidden: true,
        meta: {
          title: '消息',
          hideFrame: true,
          hideInBread: false
        },
        component: () => import('@/pages/setting/info.vue')
      },
      {
        path: '/finish',
        name: 'finish',
        meta: {
          title: '已办工单'
        },
        component: () => import('@/pages/order/doneOrder.vue')
      },
      {
        path: '/create',
        name: 'create',
        meta: {
          title: '创建工单'
        },
        component: () => import('@/pages/order/createOrder.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'system',
    component: MainView,
    meta: {
      hideInBread: true,
      title: '系统管理',
      icon: 'log'
    },
    children: [
      {
        path: '/commany',
        name: 'commany',
        meta: {
          title: '公司管理'
        },
        component: () => import('@/pages/system/company/index.vue')
      },
      {
        path: '/commanyAdd',
        name: 'commanyAdd',
        hidden: true,
        meta: {
          title: '新增公司',
          hideInBread: false
        },
        component: () => import('@/pages/system/company/companyAdd.vue')
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/pages/system/user/index.vue')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/pages/system/role/index.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'data',
    component: MainView,
    meta: {
      hideInBread: true,
      title: '数据统计',
      icon: 'log'
    },
    children: [
      {
        path: '/order',
        name: 'orderStatic',
        meta: {
          title: '工单统计'
        },
        component: () => import('@/pages/data/order/index.vue')
      },
      {
        path: '/degree',
        name: 'degree',
        meta: {
          title: '满意度统计'
        },
        component: () => import('@/pages/data/degree/index.vue')
      },
      {
        path: '/area',
        name: 'area',
        meta: {
          title: '区域统计'
        },
        component: () => import('@/pages/data/area/index.vue')
      },
      {
        path: '/support',
        name: 'support',
        meta: {
          title: '支撑单位统计'
        },
        component: () => import('@/pages/data/support/index.vue')
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/login', hidden: true }
]
