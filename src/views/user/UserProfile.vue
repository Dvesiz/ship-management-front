<template>
  <el-card shadow="never" class="profile-card">
    <el-tabs v-model="activeTab" class="profile-tabs">
      <el-tab-pane label="基本资料" name="info">
        <div class="info-container">
          <div class="avatar-section">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="uploadAvatar"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              <template #tip>
                <div class="el-upload__tip text-center">点击图片更换头像<br/>支持 jpg/png 文件</div>
              </template>
            </el-upload>
          </div>

          <div class="form-section">
            <el-form ref="infoFormRef" :model="userInfo" :rules="infoRules" label-width="100px" size="large">
              <el-form-item label="登录账号">
                <el-input v-model="userInfo.username" disabled />
              </el-form-item>
              <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="userInfo.nickname" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item label="联系邮箱" prop="email">
                <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="updating" @click="handleUpdateInfo">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="password">
        <div class="password-container">
          <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="120px" size="large">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入当前密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="5-16位非空字符" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="updating" @click="handleUpdatePwd">确认修改</el-button>
              <el-button @click="resetPwdForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import request from '../../utils/request' // 请确保这个路径是正确的，指向你的 request.js

const activeTab = ref('info')
const updating = ref(false)

// --- 基本资料逻辑 ---
const infoFormRef = ref(null)
const userInfo = ref({
  id: null,
  username: '',
  nickname: '',
  email: '',
  avatar: ''
})

const infoRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 获取当前用户信息
const getUserInfo = async () => {
  try {
    const res = await request.get('/user/info')
    if (res.code === 0) {
        userInfo.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
}

// 提交基本信息修改 (不含头像，头像单独处理)
const handleUpdateInfo = async () => {
  if (!infoFormRef.value) return
  await infoFormRef.value.validate(async (valid) => {
    if (valid) {
      updating.value = true
      try {
        // 调用 PUT /user/update
        await request.put('/user/update', userInfo.value)
        ElMessage.success('资料修改成功')
        getUserInfo() // 刷新数据
      } catch (e) {
        // 错误已由拦截器处理
      } finally {
        updating.value = false
      }
    }
  })
}

// --- 头像上传逻辑 ---
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像必须是 JPG 或 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const uploadAvatar = async ({ file }) => {
  const fd = new FormData()
  fd.append('file', file)
  try {
    // 1. 先上传文件到服务器，获取 URL
    const uploadRes = await request.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const avatarUrl = uploadRes.data
    
    // 2. 调用后端接口 PATCH /user/avatar 更新用户头像字段
    await request.patch('/user/avatar', null, {
      params: { avatarUrl: avatarUrl }
    })

    userInfo.value.avatar = avatarUrl
    ElMessage.success('头像更新成功')
  } catch (e) {
    ElMessage.error('头像上传失败')
  }
}

// --- 修改密码逻辑 ---
const pwdFormRef = ref(null)
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 自定义校验：确认密码
const validateConfirmPwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const pwdRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPwd, trigger: 'blur' }
  ]
}

const handleUpdatePwd = async () => {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      updating.value = true
      try {
        // 调用 PATCH /user/password
        await request.patch('/user/password', null, {
          params: {
            oldPassword: pwdForm.oldPassword,
            newPassword: pwdForm.newPassword
          }
        })
        ElMessage.success('密码修改成功')
        resetPwdForm()
      } catch (e) {
        // 错误处理
      } finally {
        updating.value = false
      }
    }
  })
}

const resetPwdForm = () => {
  if (pwdFormRef.value) pwdFormRef.value.resetFields()
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.profile-card {
  min-height: 500px;
}
.profile-tabs {
  padding: 10px;
}
.info-container {
  display: flex;
  margin-top: 20px;
}
.avatar-section {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40px;
  border-right: 1px solid #eee;
  padding-right: 20px;
}
.form-section {
  flex: 1;
  max-width: 500px;
}
.password-container {
  margin-top: 20px;
  max-width: 500px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 140px;
  text-align: center;
  line-height: 140px;
}
.avatar {
  width: 140px;
  height: 140px;
  display: block;
  object-fit: cover;
}
.text-center {
  text-align: center;
  margin-top: 10px;
  color: #909399;
  line-height: 1.5;
}
</style>