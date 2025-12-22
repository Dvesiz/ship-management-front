import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // 配合 vite.config.js 的代理
  timeout: 5000
})

// 请求拦截器：自动添加 Token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器：处理全局错误
service.interceptors.response.use(
  response => {
    const res = response.data
    // 如果后端返回 code 不为 0，视为业务错误（根据你的 Result.java）
    if (res.code !== 0) {
      // 可以引入 naive-ui 的 message 在这里提示，或者抛出异常
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  error => {
    // 处理 401 未登录等情况
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token')
        location.reload() // 强制刷新跳转回登录页
    }
    return Promise.reject(error)
  }
)

export default service