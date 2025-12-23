import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user' // 1. 引入 store
import AdminLayout from '../layout/AdminLayout.vue'
import Login from '../Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/ship',
    children: [
      {
        path: 'ship',
        name: 'Ship',
        component: () => import('../views/ship/ShipList.vue'),
        meta: { title: '船舶管理' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('../views/category/CategoryList.vue'),
        meta: { title: '船舶类型' }
      },
      {
        path: 'crew',
        name: 'Crew',
        component: () => import('../views/crew/CrewList.vue'),
        meta: { title: '船员管理' }
      },
      {
        path: 'voyage',
        name: 'Voyage',
        component: () => import('../views/voyage/VoyageList.vue'),
        meta: { title: '航次记录' }
      },
      {
        path: 'maintenance',
        name: 'Maintenance',
        component: () => import('../views/maintenance/MaintenanceList.vue'),
        meta: { title: '维修保养' }
      },
      {
        path: 'user/profile',
        name: 'UserProfile',
        component: () => import('../views/user/UserProfile.vue'),
        meta: { title: '个人中心' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore() // 2. 获取 store 实例

  // 如果没有 Token 且访问非登录页，强制跳转登录
  if (to.path !== '/login' && !token) {
    return next('/login')
  }

  // 3. 【核心修复逻辑】如果有 Token，但是 Store 中没有用户信息，则重新获取
  if (token && !userStore.user.username) {
    try {
      await userStore.getUser() // 重新调用后端接口获取信息
    } catch (e) {
      // 如果获取失败（比如 Token 过期），清除 Token 并跳转登录
      localStorage.removeItem('token')
      return next('/login')
    }
  }

  next()
})

export default router