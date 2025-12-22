<template>
  <n-layout has-sider class="layout-container">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
      class="sider"
    >
      <div class="logo">
        <n-icon size="30" color="#18a058"><BoatOutline /></n-icon>
        <span v-if="!collapsed" class="title">船舶系统</span>
      </div>
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuUpdate"
      />
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered class="header">
        <div class="header-left">
           <h3>管理控制台</h3>
        </div>
        <div class="header-right">
          <n-dropdown :options="userOptions" @select="handleUserSelect">
            <div class="user-info">
              <n-avatar round size="small" :src="userInfo?.avatarUrl || 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'" />
              <span class="username">{{ userInfo?.nickname || userInfo?.username || '管理员' }}</span>
            </div>
          </n-dropdown>
        </div>
      </n-layout-header>

      <n-layout-content content-style="padding: 24px; background-color: #f0f2f5;">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { h, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// 【修复】手动导入所有用到的 Naive UI 组件
import { 
  NLayout, 
  NLayoutSider, 
  NLayoutHeader, 
  NLayoutContent, 
  NMenu, 
  NIcon, 
  NDropdown, 
  NAvatar 
} from 'naive-ui'
import { 
  BoatOutline, 
  PeopleOutline, 
  MapOutline, 
  ConstructOutline, 
  LogOutOutline,
  ListOutline
} from '@vicons/ionicons5'
import request from '../utils/request'

const router = useRouter()
const route = useRoute()

// 状态
const collapsed = ref(false)
const activeKey = ref(route.name)
const userInfo = ref({})

// 渲染图标辅助函数
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 菜单配置
const menuOptions = [
  {
    label: '船舶管理',
    key: 'ShipList',
    icon: renderIcon(BoatOutline)
  },
  {
    label: '船舶类型',
    key: 'CategoryList',
    icon: renderIcon(ListOutline)
  },
  {
    label: '船员管理',
    key: 'CrewList',
    icon: renderIcon(PeopleOutline)
  },
  {
    label: '航次记录',
    key: 'VoyageList',
    icon: renderIcon(MapOutline)
  },
  {
    label: '维修保养',
    key: 'MaintenanceList',
    icon: renderIcon(ConstructOutline)
  }
]

// 用户下拉菜单
const userOptions = [
  { label: '退出登录', key: 'logout', icon: renderIcon(LogOutOutline) }
]

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await request.get('/user/info')
    userInfo.value = res.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchUserInfo()
})

// 菜单跳转
const handleMenuUpdate = (key) => {
  activeKey.value = key
  if (key === 'ShipList') router.push('/ship')
  if (key === 'CategoryList') router.push('/category')
  if (key === 'CrewList') router.push('/crew')
  if (key === 'VoyageList') router.push('/voyage')
  if (key === 'MaintenanceList') router.push('/maintenance')
}

// 用户操作
const handleUserSelect = (key) => {
  if (key === 'logout') {
    localStorage.removeItem('token')
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #efeff5;
  gap: 10px;
}

.logo .title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f7f7fa;
}

.username {
  margin-left: 8px;
  font-size: 14px;
  color: #333;
}
</style>