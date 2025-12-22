import { createRouter, createWebHistory } from 'vue-router'

// ↓↓↓↓↓↓↓ 修改了这一行 ↓↓↓↓↓↓↓
import Login from '../Login.vue' // 原来是 '../components/Login.vue'
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

import AdminLayout from '../layout/AdminLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/ship',
    children: [
      {
        path: 'ship',
        name: 'ShipList',
        // 请确保你已经创建了 src/views/ship/ShipList.vue 文件
        component: () => import('../views/ship/ShipList.vue'),
        meta: { title: '船舶管理' }
      },
      {
        path: 'category',
        name: 'CategoryList',
        component: () => import('../views/category/CategoryList.vue'),
        meta: { title: '船舶类型' }
      },
      {
        path: 'crew',
        name: 'CrewList',
        component: () => import('../views/crew/CrewList.vue'),
        meta: { title: '船员管理' }
      },
      {
        path: 'voyage',
        name: 'VoyageList',
        component: () => import('../views/voyage/VoyageList.vue'),
        meta: { title: '航次管理' }
      },
      {
        path: 'maintenance',
        name: 'MaintenanceList',
        component: () => import('../views/maintenance/MaintenanceList.vue'),
        meta: { title: '维修记录' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router