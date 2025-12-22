<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="login-banner">
        <div class="banner-content">
          <div class="logo-circle">
            <el-icon size="48" color="#fff"><Ship /></el-icon>
          </div>
          <h1 class="app-title">船舶管理系统</h1>
          <p class="app-desc">高效 · 智能 · 安全</p>
          <div class="decoration-circles">
            <span class="circle c1"></span>
            <span class="circle c2"></span>
          </div>
        </div>
      </div>

      <div class="login-form-container">
        <el-tabs v-model="activeTab" class="custom-tabs">
          <el-tab-pane label="欢迎登录" name="login">
            <div class="login-type-switch">
              <span :class="{ active: loginType === 'account' }" @click="loginType = 'account'">账号密码</span>
              <el-divider direction="vertical" />
              <span :class="{ active: loginType === 'email' }" @click="loginType = 'email'">邮箱验证</span>
            </div>

            <div v-show="loginType === 'account'" class="form-animate">
              <el-form ref="accountFormRef" :model="accountForm" :rules="accountRules" size="large" @keyup.enter="handleAccountLogin">
                <el-form-item prop="username">
                  <el-input v-model="accountForm.username" placeholder="用户名" :prefix-icon="User" class="custom-input"/>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="accountForm.password" type="password" placeholder="密码" :prefix-icon="Lock" show-password class="custom-input"/>
                </el-form-item>
                
                <el-form-item prop="captcha">
                  <div class="captcha-row">
                    <el-input v-model="accountForm.captcha" placeholder="输入验证码" :prefix-icon="CircleCheck" class="custom-input captcha-input"/>
                    <div class="captcha-img-box" @click="getCaptcha" title="点击刷新">
                      <img v-if="captchaData.img" :src="captchaData.img" alt="验证码" />
                      <span v-else>加载中...</span>
                    </div>
                  </div>
                </el-form-item>

                <el-button type="primary" :loading="loading" class="submit-btn" @click="handleAccountLogin">登 录</el-button>
              </el-form>
            </div>

            <div v-show="loginType === 'email'" class="form-animate">
              <el-form ref="emailLoginFormRef" :model="emailLoginForm" :rules="emailLoginRules" size="large" @keyup.enter="handleEmailLogin">
                <el-form-item prop="email">
                  <el-input v-model="emailLoginForm.email" placeholder="邮箱地址" :prefix-icon="Message" class="custom-input" />
                </el-form-item>
                <el-form-item prop="code">
                  <div class="code-row">
                    <el-input v-model="emailLoginForm.code" placeholder="6位邮件验证码" :prefix-icon="Key" class="custom-input code-input" />
                    <el-button class="code-btn" :disabled="timer > 0" :loading="sending" @click="sendCode(emailLoginForm.email)">
                      {{ timer > 0 ? `${timer}s` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>
                <el-button type="primary" :loading="loading" class="submit-btn" @click="handleEmailLogin">登 录</el-button>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane label="注册新账号" name="register">
            <div class="form-animate">
              <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
                <el-form-item prop="username">
                  <el-input v-model="registerForm.username" placeholder="设置用户名 (5-16位)" :prefix-icon="User" class="custom-input" />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="registerForm.password" type="password" placeholder="设置密码 (5-16位)" :prefix-icon="Lock" show-password class="custom-input" />
                </el-form-item>
                <el-form-item prop="email">
                  <el-input v-model="registerForm.email" placeholder="绑定邮箱" :prefix-icon="Message" class="custom-input" />
                </el-form-item>
                
                <el-form-item prop="captcha">
                  <div class="captcha-row">
                    <el-input v-model="registerForm.captcha" placeholder="图形验证码" :prefix-icon="CircleCheck" class="custom-input captcha-input"/>
                    <div class="captcha-img-box" @click="getCaptcha" title="点击刷新">
                      <img v-if="captchaData.img" :src="captchaData.img" alt="验证码" />
                    </div>
                  </div>
                </el-form-item>

                <el-form-item prop="code">
                  <div class="code-row">
                    <el-input v-model="registerForm.code" placeholder="邮箱验证码" :prefix-icon="Key" class="custom-input code-input" />
                    <el-button class="code-btn" :disabled="timer > 0" :loading="sending" @click="sendCode(registerForm.email)">
                      {{ timer > 0 ? `${timer}s` : '发送邮件' }}
                    </el-button>
                  </div>
                </el-form-item>
                <el-button type="success" :loading="loading" class="submit-btn register-btn" @click="handleRegister">立即注册</el-button>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Key, Ship, CircleCheck } from '@element-plus/icons-vue'
import request from './utils/request'

const router = useRouter()
const activeTab = ref('login')
const loginType = ref('account')
const loading = ref(false)
const sending = ref(false)
const timer = ref(0)
let intervalId = null

const accountFormRef = ref(null)
const emailLoginFormRef = ref(null)
const registerFormRef = ref(null)

// 验证码数据 (img: Base64图片, uuid: 唯一标识)
const captchaData = reactive({ img: '', uuid: '' })

// 表单数据 (注意增加了 captcha 和 captchaUuid)
const accountForm = reactive({ username: '', password: '', captcha: '', captchaUuid: '' })
const emailLoginForm = reactive({ email: '', code: '' })
const registerForm = reactive({ username: '', password: '', email: '', code: '', captcha: '', captchaUuid: '' })

const commonRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 5, max: 16, message: '5-16位', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 16, message: '5-16位', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '格式错误', trigger: 'blur' }],
  code: [{ required: true, message: '请输入邮件验证码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入图形验证码', trigger: 'blur' }]
}

const accountRules = { 
  username: commonRules.username, 
  password: commonRules.password, 
  captcha: commonRules.captcha 
}
const emailLoginRules = { email: commonRules.email, code: commonRules.code }
const registerRules = { ...commonRules }

// 核心逻辑：获取验证码
const getCaptcha = async () => {
  try {
    const res = await request.get('/user/captcha')
    if (res.code === 0) {
      captchaData.img = res.data.img
      captchaData.uuid = res.data.uuid
      // 将 UUID 同步到表单中，提交时一起发给后端
      accountForm.captchaUuid = res.data.uuid
      registerForm.captchaUuid = res.data.uuid
    }
  } catch (e) {
    console.error('获取验证码失败', e)
  }
}

// 页面加载时获取一次验证码
onMounted(() => {
  getCaptcha()
})

const startTimer = () => {
  timer.value = 60
  intervalId = setInterval(() => {
    timer.value--
    if (timer.value <= 0) clearInterval(intervalId)
  }, 1000)
}
onBeforeUnmount(() => { if (intervalId) clearInterval(intervalId) })

const sendCode = async (email) => {
  if (!email) return ElMessage.warning('请先输入邮箱')
  // 为了安全，其实这里最好也校验一下图形验证码，防止接口被刷
  // 但为了简化体验，这里先只发邮件
  sending.value = true
  try {
    await request.post('/user/send-code', null, { params: { email } })
    ElMessage.success('邮件发送成功')
    startTimer()
  } catch (e) {} finally { sending.value = false }
}

const handleAccountLogin = async () => {
  if (!accountFormRef.value) return
  await accountFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 提交参数: username, password, captcha, captchaUuid
        const res = await request.post('/user/login', null, { params: { ...accountForm } })
        localStorage.setItem('token', res.data)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (e) {
        // 失败后刷新验证码，清空输入
        getCaptcha()
        accountForm.captcha = ''
      } finally { loading.value = false }
    }
  })
}

const handleEmailLogin = async () => {
  if (!emailLoginFormRef.value) return
  await emailLoginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await request.post('/user/loginByEmail', null, { params: { ...emailLoginForm } })
        localStorage.setItem('token', res.data)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (e) {} finally { loading.value = false }
    }
  })
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await request.post('/user/register', null, { params: { ...registerForm } })
        ElMessage.success('注册成功，请登录')
        // 切换到登录Tab并重置
        activeTab.value = 'login'
        loginType.value = 'account'
        accountForm.username = registerForm.username
        registerForm.password = ''
        registerForm.code = ''
        registerForm.captcha = ''
        getCaptcha()
      } catch (e) {
        getCaptcha()
      } finally { loading.value = false }
    }
  })
}
</script>

<style scoped>
/* 保持原有样式，增加验证码相关 */
.login-wrapper { height: 100vh; width: 100%; background-color: #f0f2f5; background-image: radial-gradient(at 10% 10%, rgba(64, 158, 255, 0.1) 0px, transparent 50%), radial-gradient(at 90% 90%, rgba(64, 158, 255, 0.1) 0px, transparent 50%); display: flex; justify-content: center; align-items: center; }
.login-box { width: 900px; height: 520px; background: #fff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); display: flex; overflow: hidden; }
.login-banner { width: 45%; background: linear-gradient(135deg, #001529 0%, #003a8c 100%); position: relative; display: flex; justify-content: center; align-items: center; color: #fff; }
.banner-content { position: relative; z-index: 2; text-align: center; }
.logo-circle { width: 80px; height: 80px; background: rgba(255, 255, 255, 0.15); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 20px; backdrop-filter: blur(5px); }
.app-title { font-size: 26px; font-weight: 600; margin-bottom: 8px; letter-spacing: 1px; }
.app-desc { font-size: 14px; opacity: 0.8; font-weight: 300; }
.decoration-circles .circle { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.05); }
.c1 { width: 200px; height: 200px; top: -50px; left: -50px; }
.c2 { width: 300px; height: 300px; bottom: -80px; right: -80px; }
.login-form-container { flex: 1; padding: 40px 50px; display: flex; flex-direction: column; justify-content: center; }
.login-type-switch { margin-bottom: 25px; text-align: center; color: #606266; font-size: 14px; }
.login-type-switch span { cursor: pointer; padding: 0 8px; transition: color 0.3s; }
.login-type-switch span.active { color: #409EFF; font-weight: 600; }
.login-type-switch span:hover { color: #409EFF; }
.custom-input :deep(.el-input__wrapper) { background-color: #f5f7fa; box-shadow: none !important; border: 1px solid transparent; transition: all 0.3s; }
.custom-input :deep(.el-input__wrapper:hover), .custom-input :deep(.el-input__wrapper.is-focus) { background-color: #fff; border-color: #409EFF; box-shadow: 0 0 0 1px #409EFF !important; }
.code-row, .captcha-row { display: flex; gap: 12px; align-items: center; }
.code-input, .captcha-input { flex: 1; }
.code-btn { width: 100px; background-color: #f5f7fa; border: none; color: #606266; }
.code-btn:hover { background-color: #e6e8eb; color: #409EFF; }
.submit-btn { width: 100%; margin-top: 10px; height: 40px; font-size: 16px; font-weight: 500; letter-spacing: 2px; }
.register-btn { background: linear-gradient(90deg, #13ce66 0%, #08b653 100%); border: none; }
.form-animate { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
:deep(.el-tabs__nav-wrap::after) { height: 1px; background-color: #e4e7ed; }
:deep(.el-tabs__item) { font-size: 16px; height: 50px; }

/* 验证码图片框样式 */
.captcha-img-box { width: 120px; height: 40px; border-radius: 4px; overflow: hidden; cursor: pointer; border: 1px solid #dcdfe6; display: flex; align-items: center; justify-content: center; background: #fff; transition: all 0.2s; }
.captcha-img-box:hover { opacity: 0.8; border-color: #409EFF; }
.captcha-img-box img { width: 100%; height: 100%; object-fit: cover; }
</style>