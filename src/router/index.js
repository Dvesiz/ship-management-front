import { createRouter, createWebHistory } from 'vue-router'
// 导入布局组件
import AdminLayout from '../layout/AdminLayout.vue'
// 导入登录组件
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
      // --- 个人中心路由 ---
      {
        path: 'user/profile',
        name: 'UserProfile',
        // 确保文件真实存在于 src/views/user/UserProfile.vue
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

// 路由守卫：校验 Token
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router