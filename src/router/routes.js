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
          icon: 'control',
          title: '待办工单'
        },
        component: () => import('@/pages/policy/control/user/index.vue')
      },
      {
        path: '/finish',
        name: 'finish',
        meta: {
          icon: 'control',
          title: '已办工单'
        },
        component: () => import('@/pages/policy/control/index.vue')
      },
      {
        path: '/create',
        name: 'create',
        meta: {
          icon: 'deploy',
          title: '创建工单'
        },
        component: () => import('@/pages/policy/deploy/index.vue')
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
          icon: 'audit',
          title: '公司管理'
        },
        component: () => import('@/pages/system/company/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          icon: 'config',
          title: '用户管理'
        },
        component: () => import('@/pages/system/user/index.vue')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          icon: 'config',
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
          icon: 'audit',
          title: '工单统计'
        },
        component: () => import('@/pages/data/order/index.vue')
      },
      {
        path: '/degree',
        name: 'degree',
        meta: {
          icon: 'config',
          title: '满意度统计'
        },
        component: () => import('@/pages/data/degree/index.vue')
      },
      {
        path: '/area',
        name: 'area',
        meta: {
          icon: 'config',
          title: '区域统计'
        },
        component: () => import('@/pages/data/area/index.vue')
      },
      {
        path: '/support',
        name: 'support',
        meta: {
          icon: 'config',
          title: '支撑单位统计'
        },
        component: () => import('@/pages/data/support/index.vue')
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/login', hidden: true }
]
