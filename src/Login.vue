<template>
  <div class="login-container">
    <n-card class="login-card" size="large" bordered>
      <template #header>
        <div class="card-header">
          <h2>船舶管理系统</h2>
        </div>
      </template>

      <n-tabs
        v-model:value="activeTab"
        class="custom-tabs"
        type="segment"
        animated
      >
        <n-tab-pane name="login" tab="登录">
          <n-tabs type="line" animated size="small" justify-content="space-evenly">
            
            <n-tab-pane name="account-login" tab="账号密码登录">
              <n-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginRules"
                label-placement="left"
                label-width="auto"
                size="large"
              >
                <n-form-item path="username">
                  <n-input
                    v-model:value="loginForm.username"
                    placeholder="请输入用户名 (5-16位)"
                  >
                    <template #prefix>
                      <n-icon><person-outline /></n-icon>
                    </template>
                  </n-input>
                </n-form-item>

                <n-form-item path="password">
                  <n-input
                    v-model:value="loginForm.password"
                    type="password"
                    show-password-on="click"
                    placeholder="请输入密码 (5-16位)"
                    @keydown.enter="handleLogin"
                  >
                    <template #prefix>
                      <n-icon><lock-closed-outline /></n-icon>
                    </template>
                  </n-input>
                </n-form-item>

                <n-button
                  type="primary"
                  block
                  size="large"
                  :loading="loading"
                  @click="handleLogin"
                >
                  登录
                </n-button>
              </n-form>
            </n-tab-pane>

            <n-tab-pane name="email-login" tab="邮箱快捷登录">
              <n-form
                ref="emailLoginFormRef"
                :model="emailLoginForm"
                :rules="emailLoginRules"
                size="large"
              >
                <n-form-item path="email">
                  <n-input
                    v-model:value="emailLoginForm.email"
                    placeholder="请输入邮箱"
                  >
                    <template #prefix>
                      <n-icon><mail-outline /></n-icon>
                    </template>
                  </n-input>
                </n-form-item>

                <n-form-item path="code">
                  <n-input-group>
                    <n-input
                      v-model:value="emailLoginForm.code"
                      placeholder="6位验证码"
                    >
                      <template #prefix>
                        <n-icon><key-outline /></n-icon>
                      </template>
                    </n-input>
                    <n-button
                      :disabled="countdown > 0"
                      :loading="sendingCode"
                      @click="handleSendCode(emailLoginForm.email)"
                    >
                      {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
                    </n-button>
                  </n-input-group>
                </n-form-item>

                <n-button
                  type="primary"
                  block
                  size="large"
                  :loading="loading"
                  @click="handleEmailLogin"
                >
                  登录
                </n-button>
              </n-form>
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>

        <n-tab-pane name="register" tab="注册账号">
          <n-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-placement="left"
            label-width="auto"
            size="large"
          >
            <n-form-item path="username">
              <n-input
                v-model:value="registerForm.username"
                placeholder="用户名 (5-16位，无空格)"
              >
                <template #prefix>
                  <n-icon><person-add-outline /></n-icon>
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="password">
              <n-input
                v-model:value="registerForm.password"
                type="password"
                show-password-on="click"
                placeholder="密码 (5-16位)"
              >
                <template #prefix>
                  <n-icon><lock-closed-outline /></n-icon>
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="email">
              <n-input
                v-model:value="registerForm.email"
                placeholder="请输入邮箱"
              >
                <template #prefix>
                  <n-icon><mail-outline /></n-icon>
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="code">
              <n-input-group>
                <n-input
                  v-model:value="registerForm.code"
                  placeholder="请输入验证码"
                >
                  <template #prefix>
                    <n-icon><key-outline /></n-icon>
                  </template>
                </n-input>
                <n-button
                  :disabled="countdown > 0"
                  :loading="sendingCode"
                  @click="handleSendCode(registerForm.email)"
                >
                   {{ countdown > 0 ? `${countdown}s 后重发` : '发送验证码' }}
                </n-button>
              </n-input-group>
            </n-form-item>

            <n-button
              type="primary"
              block
              size="large"
              :loading="loading"
              @click="handleRegister"
            >
              立即注册
            </n-button>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue' // 移除了 reactive，改为只引入 ref
import { 
  useMessage, 
  NCard, 
  NTabs, 
  NTabPane, 
  NForm, 
  NFormItem, 
  NInput, 
  NInputGroup, 
  NButton, 
  NIcon 
} from 'naive-ui'
import { 
  PersonOutline, 
  LockClosedOutline, 
  MailOutline, 
  KeyOutline,
  PersonAddOutline 
} from '@vicons/ionicons5'
import axios from 'axios'

// Naive UI Message 钩子
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

// ============ 数据模型 (使用 ref) ============
const loginForm = ref({ 
    username: '', 
    password: '' 
})
const emailLoginForm = ref({ 
    email: '', 
    code: '' 
})
const registerForm = ref({ 
    username: '',
    password: '', 
    email: '', 
    code: '' 
})
const ClearloginForm = () => {
    loginForm.value.username = ''
    loginForm.value.password = ''
}

const ClearEmailLoginForm = () => {
    emailLoginForm.value.email = ''
    emailLoginForm.value.code = ''
}

const ClearregisterForm = () =>{
    registerForm.value.username = ''
    registerForm.value.password = ''
    registerForm.value.email = ''
    registerForm.value.code = ''
}
// ============ 校验规则 ============
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

// 发送验证码逻辑
const handleSendCode = async (email) => {
  if (!email) return message.warning('请先输入邮箱')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return message.warning('邮箱格式不正确')

  try {
    sendingCode.value = true
    // 注意：这里不需要 .value，因为 handleSendCode 是在模板中被调用，
    // 且参数 email 是从模板中解包后的数据传过来的
    await axios.post('/api/user/send-code', null, { params: { email } })
    
    message.success('验证码已发送，请查收邮件')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (error) {
    message.error(error.response?.data?.message || '发送失败，请重试')
  } finally {
    sendingCode.value = false
  }
}

// 账号密码登录
const handleLogin = (e) => {
  e.preventDefault()
  loginFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        const res = await axios.post('/api/user/login', null, {
            // 注意：这里需要使用 .value
            params: { 
                username: loginForm.value.username, 
                password: loginForm.value.password 
            }
        })
        
        if (res.data.code === 0) {
           message.success('登录成功')
           localStorage.setItem('token', res.data.data)
           ClearloginForm()
           // 登录成功后逻辑，例如跳转
           console.log("Token:", res.data.data) 
        } else {
           message.error(res.data.message)
        }
      } catch (error) {
        message.error('登录请求失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 邮箱登录
const handleEmailLogin = (e) => {
  e.preventDefault()
  emailLoginFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        const res = await axios.post('/api/user/loginByEmail', null, {
          // 注意：这里需要使用 .value
          params: { 
            email: emailLoginForm.value.email, 
            code: emailLoginForm.value.code 
          }
        })

        if (res.data.code === 0) {
           message.success('登录成功')
           localStorage.setItem('token', res.data.data)
           ClearEmailLoginForm()
        } else {
           message.error(res.data.message)
        }
      } catch (error) {
        message.error('登录请求失败')
      } finally {
        loading.value = false
      }
    }
  })
  
}

// 注册逻辑
const handleRegister = (e) => {
  e.preventDefault()
  registerFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        const res = await axios.post('/api/user/register', null, {
          // 注意：这里需要使用 .value 解构
          params: { ...registerForm.value }
        })
        
        if(res.data.code === 0) {
            message.success('注册成功，请登录')
            activeTab.value = 'login'
            // 自动填充登录框，注意使用 .value
            loginForm.value.username = registerForm.value.username
        } else {
            message.error(res.data.message)
        }
      } catch (error) {
         message.error(error.response?.data?.message || '注册失败')
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

.card-header {
  text-align: center;
  margin-bottom: 10px;
}

.card-header h2 {
  font-weight: 600;
  color: #333;
}

:deep(.n-tabs-nav) {
  margin-bottom: 20px;
}
</style>