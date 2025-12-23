import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore('token', () => {
    // 1. 定义响应式变量，优先从本地存储获取
    const token = ref(localStorage.getItem('token') || '')

    // 2. 定义修改 token 的方法
    const setToken = (newToken) => {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    // 3. 定义移除 token 的方法
    const removeToken = () => {
        token.value = ''
        localStorage.removeItem('token')
    }

    // 4. 导出
    return {
        token,
        setToken,
        removeToken
    }
})