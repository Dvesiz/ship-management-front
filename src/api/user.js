import request from '@/utils/request'

// 1. 获取图形验证码
export const getCaptchaService = () => {
    return request.get('/user/captcha')
}

// 2. 发送邮箱验证码
// 后端：@RequestParam @Email String email
export const sendCodeService = (email) => {
    const params = new URLSearchParams()
    params.append('email', email)
    return request.post('/user/send-code', params)
}

// 3. 注册
// 后端接收多个 String 参数，建议使用表单格式提交
export const userRegisterService = (registerData) => {
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key])
    }
    return request.post('/user/register', params)
}

// 4. 账号密码登录
export const userLoginService = (loginData) => {
    const params = new URLSearchParams()
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/user/login', params)
}

// 5. 邮箱验证码登录
export const userLoginByEmailService = (data) => {
    const params = new URLSearchParams()
    params.append('email', data.email)
    params.append('code', data.code)
    return request.post('/user/loginByEmail', params)
}

// 6. 获取当前登录用户信息
export const userInfoService = () => {
    return request.get('/user/info')
}

// 7. 更新用户信息
// 后端：@RequestBody User user -> 需要传递 JSON 对象
export const updateUserInfoService = (userInfo) => {
    return request.put('/user/update', userInfo)
}

// 8. 更新头像
// 后端：@RequestParam String avatarUrl
export const updateUserAvatarService = (avatarUrl) => {
    // PATCH 请求，参数通常放在 query 中或者作为表单提交，这里使用 params 配置自动拼接到 URL
    return request.patch('/user/avatar', null, {
        params: { avatarUrl }
    })
}

// 9. 更新密码
// 后端：@RequestParam String oldPassword, @RequestParam String newPassword
export const updateUserPasswordService = (passwordData) => {
    return request.patch('/user/password', null, {
        params: passwordData
    })
}