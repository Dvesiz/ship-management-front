<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <el-icon :size="24" style="margin-right: 8px"><Ship /></el-icon>
        <span>船舶系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
        class="el-menu-vertical"
      >
        <el-menu-item index="/ship">
          <el-icon><Ship /></el-icon>
          <span>船舶管理</span>
        </el-menu-item>
        <el-menu-item index="/category">
          <el-icon><Menu /></el-icon>
          <span>船舶类型</span>
        </el-menu-item>
        <el-menu-item index="/crew">
          <el-icon><User /></el-icon>
          <span>船员管理</span>
        </el-menu-item>
        <el-menu-item index="/voyage">
          <el-icon><MapLocation /></el-icon>
          <span>航次记录</span>
        </el-menu-item>
        <el-menu-item index="/maintenance">
          <el-icon><Tools /></el-icon>
          <span>维修保养</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar 
                :size="32" 
                :src="userInfo.avatar && userInfo.avatar !== '' ? userInfo.avatar : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
              />
              <span class="username">{{ userInfo.nickname || userInfo.username || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../utils/request'

const route = useRoute()
const router = useRouter()
const userInfo = ref({})

// 计算当前激活的菜单项
const activeMenu = computed(() => route.path)

// 计算当前页面的标题（用于面包屑展示）
const currentTitle = computed(() => route.meta.title || '控制台')

// 获取当前登录用户信息
const fetchUserInfo = async () => {
  try {
    const res = await request.get('/user/info')
    if (res.code === 0) {
      userInfo.value = res.data
    }
  } catch (e) {
    console.error('获取用户信息失败', e)
  }
}

// 下拉菜单命令处理
const handleCommand = (cmd) => {
  if (cmd === 'logout') {
    // 退出登录：清除本地 Token 并跳转
    localStorage.removeItem('token')
    router.push('/login')
  } else if (cmd === 'profile') {
    // 跳转到个人中心页面
    router.push('/user/profile')
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #2b3649;
  font-weight: bold;
  font-size: 18px;
}

.el-menu-vertical {
  border-right: none;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: none;
}

.username {
  margin: 0 8px;
  color: #606266;
  font-size: 14px;
}

.main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

/* 路由切换过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>