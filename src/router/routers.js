import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/course_list',
    name: 'course_list',
    meta: {
      title: '课堂列表',
      hideInMenu: true
    },
    component: () => import('@/view/course_list/course_list.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: 'md-home'
      },
      component: () => import('@/view/single-page/home')
    }]
  },
  // {
  //   path: '',
  //   name: 'doc',
  //   meta: {
  //     title: '文档',
  //     href: 'https://lison16.github.io/iview-admin-doc/#/',
  //     icon: 'ios-book'
  //   }
  // },
  {
    path: '/classCenter',
    name: 'classCenter',
    meta: {
      icon: '_ketang',
      title: '课堂中心'
    },
    component: Main,
    children: [{
        path: 'playPpt',
        name: 'playPpt',
        meta: {
          icon: 'md-play',
          title: 'PPT播放'
        },
        component: () => import('@/view/classCenter/playPpt.vue')
      },
      {
        path: 'playPdf',
        name: 'playPdf',
        meta: {
          icon: 'md-play',
          title: 'PDF播放'
        },
        component: () => import('@/view/classCenter/playPdf.vue')
      },
      {
        path: 'wordCloud',
        name: 'wordCloud',
        meta: {
          icon: '_tepin-words-chart',
          title: '词云'
        },
        component: () => import('@/view/classCenter/wordCloud.vue')
      },
      {
        path: 'notice',
        name: 'notice',
        meta: {
          // access: ['super_admin'],
          icon: '_gonggao',
          title: '公告'
        },
        component: () => import('@/view/classCenter/notice.vue')
      }
    ]
  },
  {
    path: '/sign',
    name: 'sign',
    meta: {
      icon: '_qiandao2',
      title: '签到'
    },
    component: Main,
    children: [{
        path: 'issue_sign',
        name: 'issue_sign',
        meta: {
          icon: '_fabu',
          title: '发布新签到'
        },
        component: () => import('@/view/sign/issue_sign.vue')
      },
      {
        path: 'test_sign',
        name: 'test_sign',
        meta: {
          icon: 'md-funnel',
          title: '地图测试'
        },
        component: () => import('@/view/sign/test_sign.vue')
      },
      {
        path: 'rapid_sign',
        name: 'rapid_sign',
        meta: {
          icon: '_kuaisu3',
          title: '快速签到'
        },
        component: () => import('@/view/sign/rapid_sign.vue')
      },
      {
        path: 'record_sign',
        name: 'record_sign',
        meta: {
          icon: '_jilu',
          title: '签到记录表'
        },
        component: () => import('@/view/sign/record_sign.vue')
      }
    ]
  },
  {
    path: '/documents',
    name: 'documents',
    meta: {
      icon: 'ios-stats',
      title: '数据中心'
    },
    component: Main,
    children: [{
        path: 'file_list',
        name: 'file_list',
        meta: {
          icon: '_wenjian',
          title: '文件列表'
        },
        component: () => import('@/view/documents/file_list.vue')
      },
      {
        path: 'student_info',
        name: 'student_info',
        meta: {
          icon: '_biaoge',
          title: '学生信息'
        },
        component: () => import('@/view/documents/student_info.vue')
      },
      {
        path: 'download',
        name: 'download',
        meta: {
          icon: '_biaoge',
          title: '下载量测试'
        },
        component: () => import('@/view/documents/download.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
