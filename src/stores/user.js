import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userInfoService } from '@/api/user'

export const useUserStore = defineStore('user', () => {
    // 定义用户信息的响应式对象
    const user = ref({})

    // 调用接口获取用户信息并存储
    const getUser = async () => {
        const res = await userInfoService()
        user.value = res.data
    }

    // 清空用户信息（退出登录时使用）
    const clearUser = () => {
        user.value = {}
    }

    return {
        user,
        getUser,
        clearUser
    }
})