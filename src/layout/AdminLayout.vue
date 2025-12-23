<script setup>
import { 
  Ship, 
  UserFilled, 
  List, 
  Avatar, 
  Tools, 
  SwitchButton,
  Files
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useTokenStore } from '@/stores/token'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const tokenStore = useTokenStore()

const handleCommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('确认退出登录吗？', '提示', {
      type: 'warning'
    })
    tokenStore.removeToken()
    userStore.clearUser()
    router.push('/login')
    ElMessage.success('退出成功')
  } else if (command === 'profile') {
    router.push('/user/profile')
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">船舶管理系统</div>
      <el-menu
        active-text-color="#409EFF"
        background-color="#304156"
        text-color="#bfcbd9"
        :default-active="$route.path"
        router
      >
        <el-menu-item index="/ship">
          <el-icon><Ship /></el-icon>
          <span>船舶管理</span>
        </el-menu-item>
        
        <el-menu-item index="/category">
          <el-icon><Files /></el-icon>
          <span>船舶分类</span>
        </el-menu-item>
        
        <el-menu-item index="/crew">
          <el-icon><UserFilled /></el-icon>
          <span>船员管理</span>
        </el-menu-item>

        <el-menu-item index="/voyage">
          <el-icon><List /></el-icon>
          <span>航行记录</span>
        </el-menu-item>

        <el-menu-item index="/maintenance">
          <el-icon><Tools /></el-icon>
          <span>维护记录</span>
        </el-menu-item>

        <el-menu-item index="/user/profile">
          <el-icon><Avatar /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="breadcrumb">
          当前位置：{{ $route.meta.title || '首页' }}
        </div>
        
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar 
                :size="32" 
                :src="userStore.user.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
              />
              <span class="username">
                {{ userStore.user.nickname || userStore.user.username || '未登录' }}
              </span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="UserFilled">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: #2b2f3a;
}

.el-menu {
  border-right: none;
}

.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
</style>