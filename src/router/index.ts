import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/pc/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home
    },
    {
      path: '/search',
      name: '搜索结果',
      component: () => import('../views/pc/SearchPage.vue')
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('../views/pc/LoginPage.vue')
    },
    {
      path: '/register',
      name: '注册',
      component: () => import('../views/pc/RegisterPage.vue')
    },
    {
      path: '/document/:id',
      name: '文档详情',
      component: () => import('../views/pc/DocumentDetail.vue')
    },
    {
      path: '/collection/:id',
      name: '文集详情',
      component: () => import('../views/pc/CollectionDetail.vue')
    },
    {
      path: '/upload',
      name: '上传文档',
      component: () => import('../views/pc/UploadPage.vue')
    },
    {
      path: '/profile',
      name: '个人中心',
      component: () => import('../views/pc/ProfilePage.vue')
    },
    {
      path: '/vip',
      name: '会员中心',
      component: () => import('../views/pc/VipPage.vue')
    },
    {
      path: '/certification',
      name: '个人认证',
      component: () => import('../views/pc/CertificationLanding.vue')
    },
    {
      path: '/certification/apply',
      name: '认证申请',
      component: () => import('../views/pc/CertificationApply.vue')
    },
    {
      path: '/enterprise-certification',
      name: '企业认证',
      component: () => import('../views/pc/EnterpriseLanding.vue')
    },
    {
      path: '/enterprise-certification/apply',
      name: '企业认证申请',
      component: () => import('../views/pc/EnterpriseApply.vue')
    },
    {
      path: '/help',
      name: '帮助中心',
      component: () => import('../views/pc/HelpPage.vue')
    },
    {
      path: '/tasks',
      name: '任务广场',
      component: () => import('../views/pc/TaskSquare.vue')
    },
    {
      path: '/task/:id',
      name: '任务详情',
      component: () => import('../views/pc/TaskDetail.vue')
    },
    {
      path: '/task/publish',
      name: '发布任务',
      component: () => import('../views/pc/PublishTask.vue')
    },
    {
      path: '/mobile',
      component: () => import('../components/PhoneFrame.vue'),
      redirect: '/mobile/home',
      children: [
        {
          path: 'home',
          name: 'MobileHome',
          component: () => import('../views/mobile/MobileHome.vue')
        },
        {
          path: 'search',
          name: 'MobileSearch',
          component: () => import('../views/mobile/MobileSearch.vue')
        },
        {
          path: 'detail/:id',
          name: 'MobileDetail',
          component: () => import('../views/mobile/MobileDetail.vue')
        },
        {
          path: 'vip',
          name: 'MobileVip',
          meta: { mobileDarkMode: true },
          component: () => import('../views/mobile/MobileVip.vue')
        },
        {
          path: 'profile',
          name: 'MobileProfile',
          component: () => import('../views/mobile/MobileProfile.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: '管理概览',
          meta: { title: '仪表盘' },
          component: () => import('../views/admin/Dashboard.vue')
        },
        {
          path: 'users',
          name: '用户管理',
          meta: { title: '用户管理' },
          component: () => import('../views/admin/UserManagement.vue')
        },
        {
          path: 'documents',
          name: '文档管理',
          meta: { title: '文档管理' },
          component: () => import('../views/admin/DocumentManagement.vue')
        },
        {
          path: 'collections',
          name: '文集管理',
          meta: { title: '文集管理' },
          component: () => import('../views/admin/CollectionManagement.vue')
        },
        {
          path: 'tasks',
          name: '任务管理',
          meta: { title: '任务管理' },
          component: () => import('../views/admin/TaskManagement.vue')
        },
        {
          path: 'reports',
          name: '举报管理',
          meta: { title: '举报管理' },
          component: () => import('../views/admin/ReportManagement.vue')
        },
        {
          path: 'tickets',
          name: '工单管理',
          meta: { title: '工单管理' },
          component: () => import('../views/admin/TicketManagement.vue')
        },
        {
          path: 'credit',
          name: '信誉分管理',
          meta: { title: '信誉分管理' },
          component: () => import('../views/admin/CreditManagement.vue')
        },
        {
          path: 'banners',
          name: '轮播图管理',
          meta: { title: '轮播图管理' },
          component: () => import('../views/admin/BannerManagement.vue')
        },
        {
          path: 'payment-config',
          name: '金额配置',
          meta: { title: '金额配置' },
          component: () => import('../views/admin/AmountConfig.vue')
        },
        {
          path: 'ai-config',
          name: 'AI配置',
          meta: { title: 'AI配置' },
          component: () => import('../views/admin/AiConfig.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/pc/NotFound.vue')
    }
  ]
})

export default router
