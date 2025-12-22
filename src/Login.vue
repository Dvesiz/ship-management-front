<template>
  <div class="login-container">
    <n-card class="login-card" size="large" bordered>
      <template #header>
        <div class="card-header">
          <h2>船舶管理系统</h2>
        </div>
      </template>

      <n-tabs v-model:value="activeTab" class="custom-tabs" type="segment" animated>
        <n-tab-pane name="login" tab="登录">
          <n-tabs type="line" animated size="small" justify-content="space-evenly">
            <n-tab-pane name="account-login" tab="账号密码登录">
              <n-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-placement="left" label-width="auto" size="large">
                <n-form-item path="username">
                  <n-input v-model:value="loginForm.username" placeholder="请输入用户名 (5-16位)">
                    <template #prefix><n-icon><person-outline /></n-icon></template>
                  </n-input>
                </n-form-item>
                <n-form-item path="password">
                  <n-input v-model:value="loginForm.password" type="password" show-password-on="click" placeholder="请输入密码 (5-16位)" @keydown.enter="handleLogin">
                    <template #prefix><n-icon><lock-closed-outline /></n-icon></template>
                  </n-input>
                </n-form-item>
                <n-button type="primary" block size="large" :loading="loading" @click="handleLogin">登录</n-button>
              </n-form>
            </n-tab-pane>

            <n-tab-pane name="email-login" tab="邮箱快捷登录">
              <n-form ref="emailLoginFormRef" :model="emailLoginForm" :rules="emailLoginRules" size="large">
                <n-form-item path="email">
                  <n-input v-model:value="emailLoginForm.email" placeholder="请输入邮箱">
                    <template #prefix><n-icon><mail-outline /></n-icon></template>
                  </n-input>
                </n-form-item>
                <n-form-item path="code">
                  <n-input-group>
                    <n-input v-model:value="emailLoginForm.code" placeholder="6位验证码">
                      <template #prefix><n-icon><key-outline /></n-icon></template>
                    </n-input>
                    <n-button :disabled="countdown > 0" :loading="sendingCode" @click="handleSendCode(emailLoginForm.email)">
                      {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
                    </n-button>
                  </n-input-group>
                </n-form-item>
                <n-button type="primary" block size="large" :loading="loading" @click="handleEmailLogin">登录</n-button>
              </n-form>
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>

        <n-tab-pane name="register" tab="注册账号">
          <n-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-placement="left" label-width="auto" size="large">
            <n-form-item path="username">
              <n-input v-model:value="registerForm.username" placeholder="用户名 (5-16位，无空格)">
                <template #prefix><n-icon><person-add-outline /></n-icon></template>
              </n-input>
            </n-form-item>
            <n-form-item path="password">
              <n-input v-model:value="registerForm.password" type="password" show-password-on="click" placeholder="密码 (5-16位)">
                <template #prefix><n-icon><lock-closed-outline /></n-icon></template>
              </n-input>
            </n-form-item>
            <n-form-item path="email">
              <n-input v-model:value="registerForm.email" placeholder="请输入邮箱">
                <template #prefix><n-icon><mail-outline /></n-icon></template>
              </n-input>
            </n-form-item>
            <n-form-item path="code">
              <n-input-group>
                <n-input v-model:value="registerForm.code" placeholder="请输入验证码">
                  <template #prefix><n-icon><key-outline /></n-icon></template>
                </n-input>
                <n-button :disabled="countdown > 0" :loading="sendingCode" @click="handleSendCode(registerForm.email)">
                   {{ countdown > 0 ? `${countdown}s 后重发` : '发送验证码' }}
                </n-button>
              </n-input-group>
            </n-form-item>
            <n-button type="primary" block size="large" :loading="loading" @click="handleRegister">立即注册</n-button>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // 【修复1】引入路由
import { useMessage, NCard, NTabs, NTabPane, NForm, NFormItem, NInput, NInputGroup, NButton, NIcon } from 'naive-ui'
import { PersonOutline, LockClosedOutline, MailOutline, KeyOutline, PersonAddOutline } from '@vicons/ionicons5'
import request from './utils/request' // 【修复2】使用封装的 request (注意路径要对)

const router = useRouter() // 【修复3】初始化路由
const message = useMessage()

// 状态控制
const activeTab = ref('login')
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
let timer = null

// Form Refs
const loginFormRef = ref(null)
const emailLoginFormRef = ref(null)
const registerFormRef = ref(null)

// 数据模型
const loginForm = ref({ username: '', password: '' })
const emailLoginForm = ref({ email: '', code: '' })
const registerForm = ref({ username: '', password: '', email: '', code: '' })

// 校验规则 (保持不变)
const commonRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 16, message: '长度需在 5 到 16 位之间', trigger: 'blur' },
    { pattern: /^\S*$/, message: '用户名不能包含空格', trigger: 'input' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度需在 5 到 16 位之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}
const loginRules = { username: commonRules.username, password: commonRules.password }
const emailLoginRules = { email: commonRules.email, code: commonRules.code }
const registerRules = { ...commonRules }

// ============ 逻辑方法 ============

const handleSendCode = async (email) => {
  if (!email) return message.warning('请先输入邮箱')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return message.warning('邮箱格式不正确')

  try {
    sendingCode.value = true
    // 使用 request 发送 post，params 放在第二个参数或 config 中
    // 注意：request.post(url, data, config)
    // 后端 send-code 接收 Query Param，所以用 params
    await request.post('/user/send-code', null, { params: { email } })
    
    message.success('验证码已发送，请查收邮件')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (error) {
    message.error(error.message || '发送失败')
  } finally {
    sendingCode.value = false
  }
}

const handleLogin = (e) => {
  e.preventDefault()
  loginFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        // 【修复4】调用后端登录接口
        const res = await request.post('/user/login', null, {
            params: { 
                username: loginForm.value.username, 
                password: loginForm.value.password 
            }
        })
        
        // request.js 拦截器已经处理了 code !== 0 的情况，能走到这里说明成功
        message.success('登录成功')
        localStorage.setItem('token', res.data) // 存 Token
        
        // 【修复5】跳转首页
        router.push('/') 

        // 清空表单
        loginForm.value = { username: '', password: '' }
      } catch (error) {
        // 如果失败，显示后端返回的错误信息
        message.error(error.message || '登录失败')
        loginForm.value.password = ''
      } finally {
        loading.value = false
      }
    }
  })
}

const handleEmailLogin = (e) => {
  e.preventDefault()
  emailLoginFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        const res = await request.post('/user/loginByEmail', null, {
          params: { 
            email: emailLoginForm.value.email, 
            code: emailLoginForm.value.code 
          }
        })
        
        message.success('登录成功')
        localStorage.setItem('token', res.data)
        router.push('/') // 跳转
        
        emailLoginForm.value = { email: '', code: '' }
      } catch (error) {
        message.error(error.message || '登录失败')
        emailLoginForm.value.code = ''
      } finally {
        loading.value = false
      }
    }
  })
}

const handleRegister = (e) => {
  e.preventDefault()
  registerFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        await request.post('/user/register', null, {
          params: { ...registerForm.value }
        })
        
        message.success('注册成功，请登录')
        activeTab.value = 'login'
        loginForm.value.username = registerForm.value.username
        registerForm.value = { username: '', password: '', email: '', code: '' }
      } catch (error) {
         message.error(error.message || '注册失败')
         registerForm.value.password = ''
         registerForm.value.code = ''
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.card-header { text-align: center; margin-bottom: 10px; }
.card-header h2 { font-weight: 600; color: #333; }
:deep(.n-tabs-nav) { margin-bottom: 20px; }
</style>