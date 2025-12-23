<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Lock, Message, Iphone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { useUserStore } from '@/stores/user'
// 导入你的 Logo 图片 (确保文件名和路径正确)
import logo from '@/assets/logo.jpg'

import { 
  getCaptchaService, 
  sendCodeService, 
  userRegisterService, 
  userLoginService, 
  userLoginByEmailService 
} from '@/api/user'

const router = useRouter()
const tokenStore = useTokenStore()
const userStore = useUserStore()

const isRegister = ref(false) // 切换登录/注册
const loginType = ref('account') // account | email

// --- 图形验证码逻辑 ---
const captchaImg = ref('')
const captchaUuid = ref('')

const refreshCaptcha = async () => {
  const res = await getCaptchaService()
  captchaImg.value = res.data.img
  captchaUuid.value = res.data.uuid
}

// 初始化加载验证码
onMounted(() => {
  refreshCaptcha()
})

// --- 表单数据 ---
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  code: '', // 邮箱验证码
  captcha: '' // 图形验证码
})

// --- 表单校验规则 ---
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{5,16}$/, message: '密码为5-16位非空字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== form.password) callback(new Error('两次输入密码不一致'))
        else callback()
      }, 
      trigger: 'blur' 
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入图形验证码', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
  ]
}

const formRef = ref(null)

// --- 发送邮箱验证码 ---
const timer = ref(0)
const sendEmailCode = async () => {
  // 先校验邮箱格式
  formRef.value.validateField('email', async (valid) => {
    if (valid) {
      await sendCodeService(form.email)
      ElMessage.success('验证码已发送')
      // 倒计时
      timer.value = 60
      const interval = setInterval(() => {
        timer.value--
        if (timer.value <= 0) clearInterval(interval)
      }, 1000)
    }
  })
}

// --- 提交表单 (登录/注册) ---
const handleSubmit = async () => {
  await formRef.value.validate()
  
  try {
    if (isRegister.value) {
      // 注册逻辑
      await userRegisterService({
        username: form.username,
        password: form.password,
        email: form.email,
        code: form.code,
        captcha: form.captcha,
        captchaUuid: captchaUuid.value
      })
      ElMessage.success('注册成功，请登录')
      isRegister.value = false
    } else {
      // 登录逻辑
      let token = ''
      if (loginType.value === 'account') {
        const res = await userLoginService({
          username: form.username,
          password: form.password,
          captcha: form.captcha,
          captchaUuid: captchaUuid.value
        })
        token = res.data
      } else {
        const res = await userLoginByEmailService({
          email: form.email,
          code: form.code
        })
        token = res.data
      }

      // 存储 Token 和用户信息
      tokenStore.setToken(token)
      await userStore.getUser() // 获取并存储用户信息
      
      ElMessage.success('登录成功')
      router.push('/')
    }
  } catch (error) {
    // 失败刷新验证码
    refreshCaptcha()
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img :src="logo" alt="Logo" class="logo-img" />
        <div class="header-title">{{ isRegister ? '注册新账号' : '船舶管理系统' }}</div>
        <div class="header-subtitle">{{ isRegister ? '欢迎加入我们' : 'Welcome Back' }}</div>
      </div>

      <el-card class="login-card" shadow="always">
        <el-tabs v-if="!isRegister" v-model="loginType" class="custom-tabs" stretch>
          <el-tab-pane label="账号登录" name="account"></el-tab-pane>
          <el-tab-pane label="邮箱登录" name="email"></el-tab-pane>
        </el-tabs>

        <el-form ref="formRef" :model="form" :rules="rules" size="large" class="login-form">
          
          <el-form-item v-if="isRegister || loginType === 'account'" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
          </el-form-item>

          <el-form-item v-if="isRegister || loginType === 'account'" prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码" 
              :prefix-icon="Lock" 
              show-password
            />
          </el-form-item>

          <el-form-item v-if="isRegister" prop="confirmPassword">
            <el-input 
              v-model="form.confirmPassword" 
              type="password" 
              placeholder="请确认密码" 
              :prefix-icon="Lock" 
              show-password
            />
          </el-form-item>

          <el-form-item v-if="isRegister || loginType === 'email'" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" :prefix-icon="Message" />
          </el-form-item>

          <el-form-item v-if="isRegister || loginType === 'email'" prop="code">
            <div class="flex-row">
              <el-input v-model="form.code" placeholder="邮箱验证码" :prefix-icon="Iphone" class="flex-1" />
              <el-button 
                type="primary" 
                plain
                class="ml-2 code-btn" 
                :disabled="timer > 0" 
                @click="sendEmailCode"
              >
                {{ timer > 0 ? `${timer}s` : '发送验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item v-if="isRegister || loginType === 'account'" prop="captcha">
            <div class="flex-row">
              <el-input v-model="form.captcha" placeholder="验证码" :prefix-icon="Lock" class="flex-1" />
              <img 
                :src="captchaImg" 
                class="captcha-img ml-2" 
                @click="refreshCaptcha" 
                alt="验证码"
                title="点击刷新"
              />
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit-btn" @click="handleSubmit" round>
              {{ isRegister ? '立 即 注 册' : '登 录' }}
            </el-button>
          </el-form-item>

          <div class="footer-links">
            <span class="text-gray" v-if="!isRegister">还没有账号？</span>
            <span class="text-gray" v-else>已有账号？</span>
            <el-link type="primary" :underline="false" class="link-text" @click="isRegister = !isRegister; formRef.resetFields()">
              {{ isRegister ? '去登录' : '立即注册' }}
            </el-link>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
/* 背景容器：使用深海蓝渐变背景 */
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  overflow: hidden;
  position: relative;
}

/* 可以在背景加一些装饰圆（可选） */
.login-container::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  top: -100px;
  left: -100px;
}
.login-container::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  bottom: -50px;
  right: -50px;
}

.login-box {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* 头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
  color: #fff;
}

.logo-img {
  width: 80px;
  height: 80px;
  border-radius: 50%; /* 圆形 Logo */
  border: 4px solid rgba(255, 255, 255, 0.2);
  object-fit: cover;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header-title {
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 5px;
  letter-spacing: 1px;
}

/* 卡片样式 */
.login-card {
  width: 420px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.95); /* 轻微透明的白色背景 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.login-form {
  padding: 10px 10px 0;
}

/* 通用 Flex 布局 */
.flex-row {
  display: flex;
  width: 100%;
  align-items: center;
}
.flex-1 {
  flex: 1;
}
.ml-2 {
  margin-left: 12px;
}

/* 验证码图片 */
.captcha-img {
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  transition: opacity 0.2s;
}
.captcha-img:hover {
  opacity: 0.8;
}

/* 按钮样式优化 */
.submit-btn {
  width: 100%;
  font-weight: bold;
  font-size: 16px;
  padding: 20px 0;
  transition: transform 0.1s;
}
.submit-btn:active {
  transform: scale(0.98);
}

.code-btn {
  width: 110px;
}

/* 底部链接样式 */
.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -10px;
  margin-bottom: 10px;
  font-size: 14px;
}

.text-gray {
  color: #909399;
  margin-right: 5px;
}

.link-text {
  font-weight: bold;
  font-size: 14px;
}

/* 自定义 Tabs 样式 */
:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #eee;
}
:deep(.el-tabs__item) {
  font-size: 16px;
}
</style>