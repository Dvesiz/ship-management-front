# 🚢 <span data-zh="船舶管理系统" data-en="Ship Management System">船舶管理系统</span>

<div style="margin: 20px 0;">
  <button onclick="switchLanguage('zh')" style="padding: 8px 16px; border: 2px solid #409EFF; background: white; color: #409EFF; border-radius: 6px; cursor: pointer; font-weight: bold; margin-right: 10px; transition: all 0.3;" id="btn-zh">中文</button>
  <button onclick="switchLanguage('en')" style="padding: 8px 16px; border: 2px solid #409EFF; background: white; color: #409EFF; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3;" id="btn-en">English</button>
</div>

<span data-zh="**现代化的船舶运营管理平台，助力企业高效管理船舶、船员与航次**" data-en="**Modern Ship Management Platform for Efficient Fleet Operations**">**现代化的船舶运营管理平台，助力企业高效管理船舶、船员与航次**</span>

![船舶管理系统](https://img.shields.io/badge/Ship%20Management-v1.0.0-blue)
![Vue](https://img.shields.io/badge/Vue-3.5.24-brightgreen)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.13.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff)
![License](https://img.shields.io/badge/License-MIT-yellow)

<span data-zh="[在线演示](#) · [功能特性](#-功能特性) · [快速开始](#-快速开始) · [技术栈](#-技术栈) · [项目结构](#-项目结构)" data-en="[Demo](#) · [Features](#-features) · [Quick Start](#-quick-start) · [Tech Stack](#-tech-stack) · [Project Structure](#-project-structure)">[在线演示](#) · [功能特性](#-功能特性) · [快速开始](#-快速开始) · [技术栈](#-技术栈) · [项目结构](#-项目结构)</span>

</div>
<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/e187257b-2cf9-4ab7-a086-5d68e8fb695e" />
<img width="1917" height="915" alt="image" src="https://github.com/user-attachments/assets/13fd9a24-7424-4edf-ae63-7201d3521d64" />
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/a6aa9461-83fa-497d-8f30-d42ae37b05ff" />

---

## <span data-zh="📖 项目简介" data-en="📖 Project Overview">📖 项目简介</span>

<span data-zh="船舶管理系统是一个功能完善、界面美观的企业级船舶管理解决方案。系统采用前后端分离架构，提供船舶信息管理、船员管理、航次追踪、维护保养等核心功能，帮助企业实现船舶运营的数字化、智能化管理。" data-en="Ship Management System is a comprehensive and aesthetically pleasing enterprise solution for fleet management. The system uses a frontend-backend separated architecture, providing core functions such as ship information management, crew management, voyage tracking, and maintenance, helping enterprises achieve digitized and intelligent ship operations.">船舶管理系统是一个功能完善、界面美观的企业级船舶管理解决方案。系统采用前后端分离架构，提供船舶信息管理、船员管理、航次追踪、维护保养等核心功能，帮助企业实现船舶运营的数字化、智能化管理。</span>

### <span data-zh="核心亮点" data-en="Core Highlights">核心亮点</span>

- 🎨 <span data-zh="**精美UI设计** - 采用现代化设计语言，支持亮色/暗色主题切换" data-en="**Beautiful UI** - Modern design language with light/dark theme support">**精美UI设计** - 采用现代化设计语言，支持亮色/暗色主题切换</span>
- 📊 <span data-zh="**数据可视化** - 集成 ECharts，提供直观的数据统计与分析" data-en="**Data Visualization** - Integrated ECharts for intuitive data statistics and analysis">**数据可视化** - 集成 ECharts，提供直观的数据统计与分析</span>
- 🔐 <span data-zh="**多方式登录** - 支持账号密码登录与邮箱验证码登录" data-en="**Multiple Login Methods** - Supports username/password and email code login">**多方式登录** - 支持账号密码登录与邮箱验证码登录</span>
- 🚀 <span data-zh="**高性能** - 基于 Vite 构建，极速开发体验与运行速度" data-en="**High Performance** - Built with Vite for fast development and runtime performance">**高性能** - 基于 Vite 构建，极速开发体验与运行速度</span>
- 📱 <span data-zh="**响应式布局** - 完美适配桌面端与移动端" data-en="**Responsive Layout** - Perfect for desktop and mobile devices">**响应式布局** - 完美适配桌面端与移动端</span>
- 🌐 <span data-zh="**国际化** - 支持中英文切换" data-en="**i18n Support** - Supports Chinese/English switching">**国际化** - 支持中英文切换</span>

---

## <span data-zh="✨ 功能特性" data-en="✨ Features">✨ 功能特性</span>

### <span data-zh="👤 用户管理" data-en="👤 User Management">👤 用户管理</span>

- ✅ <span data-zh="用户注册与登录（支持图形验证码）" data-en="User registration and login (with captcha support)">用户注册与登录（支持图形验证码）</span>
- ✅ <span data-zh="邮箱验证码登录" data-en="Email verification code login">邮箱验证码登录</span>
- ✅ <span data-zh="密码重置功能" data-en="Password reset function">密码重置功能</span>
- ✅ <span data-zh="个人信息管理（头像、昵称等）" data-en="Personal info management (avatar, nickname, etc.)">个人信息管理（头像、昵称等）</span>
- ✅ <span data-zh="密码修改功能" data-en="Password change function">密码修改功能</span>
- ✅ <span data-zh="JWT Token 认证" data-en="JWT Token authentication">JWT Token 认证</span>

### <span data-zh="🚢 船舶管理" data-en="🚢 Ship Management">🚢 船舶管理</span>

- ✅ <span data-zh="船舶信息增删改查" data-en="Ship CRUD operations">船舶信息增删改查</span>
- ✅ <span data-zh="船舶状态管理" data-en="Ship status management">船舶状态管理</span>
- ✅ <span data-zh="船舶分类管理" data-en="Ship category management">船舶分类管理</span>
- ✅ <span data-zh="船舶数据统计" data-en="Ship data statistics">船舶数据统计</span>

### <span data-zh="👨‍✈️ 船员管理" data-en="👨‍✈️ Crew Management">👨‍✈️ 船员管理</span>

- ✅ <span data-zh="船员信息维护" data-en="Crew information maintenance">船员信息维护</span>
- ✅ <span data-zh="船员与船舶关联" data-en="Crew-ship association">船员与船舶关联</span>
- ✅ <span data-zh="船员状态追踪" data-en="Crew status tracking">船员状态追踪</span>

### <span data-zh="📍 航行记录" data-en="📍 Voyage Records">📍 航行记录</span>

- ✅ <span data-zh="航次信息记录" data-en="Voyage information recording">航次信息记录</span>
- ✅ <span data-zh="航行轨迹管理" data-en="Voyage trajectory management">航行轨迹管理</span>
- ✅ <span data-zh="航行数据统计" data-en="Voyage data statistics">航行数据统计</span>

### <span data-zh="🔧 维护保养" data-en="🔧 Maintenance">🔧 维护保养</span>

- ✅ <span data-zh="维护计划管理" data-en="Maintenance plan management">维护计划管理</span>
- ✅ <span data-zh="维护记录跟踪" data-en="Maintenance record tracking">维护记录跟踪</span>
- ✅ <span data-zh="提醒功能" data-en="Reminder function">提醒功能</span>

### <span data-zh="📊 数据看板" data-en="📊 Dashboard">📊 数据看板</span>

- ✅ <span data-zh="业务数据统计（船舶、船员、航次、维护）" data-en="Business data statistics (ships, crew, voyages, maintenance)">业务数据统计（船舶、船员、航次、维护）</span>
- ✅ <span data-zh="船舶状态分布可视化" data-en="Ship status distribution visualization">船舶状态分布可视化</span>
- ✅ <span data-zh="数据趋势分析" data-en="Data trend analysis">数据趋势分析</span>
- ✅ <span data-zh="实时数据更新" data-en="Real-time data updates">实时数据更新</span>

### <span data-zh="🎨 界面功能" data-en="🎨 UI Features">🎨 界面功能</span>

- ✅ <span data-zh="亮色/暗色主题切换" data-en="Light/dark theme toggle">亮色/暗色主题切换</span>
- ✅ <span data-zh="响应式布局" data-en="Responsive layout">响应式布局</span>
- ✅ <span data-zh="面包屑导航" data-en="Breadcrumb navigation">面包屑导航</span>
- ✅ <span data-zh="用户信息展示" data-en="User info display">用户信息展示</span>

---

## <span data-zh="🚀 快速开始" data-en="🚀 Quick Start">🚀 快速开始</span>

### <span data-zh="环境要求" data-en="Requirements">环境要求</span>

- <span data-zh="Node.js >= 16.0.0" data-en="Node.js >= 16.0.0">Node.js >= 16.0.0</span>
- <span data-zh="npm >= 7.0.0 或 pnpm >= 7.0.0" data-en="npm >= 7.0.0 or pnpm >= 7.0.0">npm >= 7.0.0 或 pnpm >= 7.0.0</span>
- <span data-zh="现代浏览器（Chrome、Firefox、Edge、Safari）" data-en="Modern browsers (Chrome, Firefox, Edge, Safari)">现代浏览器（Chrome、Firefox、Edge、Safari）</span>

### <span data-zh="安装步骤" data-en="Installation Steps">安装步骤</span>

1. <span data-zh="**克隆仓库**" data-en="**Clone Repository**">**克隆仓库**</span>

```bash
git clone https://github.com/Dvesiz/ship-management-front.git
cd ship-management-front
```

2. <span data-zh="**安装依赖**" data-en="**Install Dependencies**">**安装依赖**</span>

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install

# 或使用 yarn
yarn install
```

3. <span data-zh="**配置后端接口**" data-en="**Configure Backend**">**配置后端接口**</span>

<span data-zh="编辑 `src/utils/request.js`，修改 `baseURL` 为你的后端服务地址：" data-en="Edit `src/utils/request.js` and change `baseURL` to your backend address:">编辑 `src/utils/request.js`，修改 `baseURL` 为你的后端服务地址：</span>

```javascript
const service = axios.create({
  baseURL: '/api', // <span data-zh="开发环境通过 Vite 代理转发" data-en="Proxied by Vite in development">开发环境通过 Vite 代理转发</span>
  timeout: 15000
})
```

<span data-zh="开发环境代理配置已在 `vite.config.js` 中配置：" data-en="Development proxy is configured in `vite.config.js`:">开发环境代理配置已在 `vite.config.js` 中配置：</span>

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

4. <span data-zh="**启动开发服务器**" data-en="**Start Development Server**">**启动开发服务器**</span>

```bash
npm run dev
```

5. <span data-zh="**访问应用**" data-en="**Access Application**">**访问应用**</span>

<span data-zh="打开浏览器访问 [http://localhost:5173](http://localhost:5173)" data-en="Open your browser and visit [http://localhost:5173](http://localhost:5173)">打开浏览器访问 [http://localhost:5173](http://localhost:5173)</span>

6. <span data-zh="**生产构建**" data-en="**Build for Production**">**生产构建**</span>

```bash
npm run build
```

<span data-zh="构建产物将生成在 `dist` 目录下。" data-en="The build output will be in the `dist` directory.">构建产物将生成在 `dist` 目录下。</span>

---

## <span data-zh="🛠 技术栈" data-en="🛠 Tech Stack">🛠 技术栈</span>

### <span data-zh="核心框架" data-en="Core Frameworks">核心框架</span>

| <span data-zh="技术" data-en="Technology">技术</span> | <span data-zh="版本" data-en="Version">版本</span> | <span data-zh="说明" data-en="Description">说明</span>       |
| ----------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| [Vue](https://vuejs.org/)                             | 3.5.24                                             | <span data-zh="渐进式 JavaScript 框架" data-en="Progressive JavaScript Framework">渐进式 JavaScript 框架</span> |
| [Vite](https://vitejs.dev/)                           | 7.2.4                                              | <span data-zh="下一代前端构建工具" data-en="Next-gen frontend build tool">下一代前端构建工具</span> |
| [Vue Router](https://router.vuejs.org/)               | 4.6.4                                              | <span data-zh="Vue 官方路由管理器" data-en="Official Vue router">Vue 官方路由管理器</span> |
| [Pinia](https://pinia.vuejs.org/)                     | 3.0.4                                              | <span data-zh="Vue 状态管理库" data-en="Vue state management">Vue 状态管理库</span> |

### <span data-zh="UI 组件库" data-en="UI Component Libraries">UI 组件库</span>

| <span data-zh="技术" data-en="Technology">技术</span>        | <span data-zh="版本" data-en="Version">版本</span> | <span data-zh="说明" data-en="Description">说明</span>       |
| ------------------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------ |
| [Element Plus](https://element-plus.org/)                    | 2.13.0                                             | <span data-zh="Vue 3 组件库" data-en="Vue 3 component library">Vue 3 组件库</span> |
| [@element-plus/icons-vue](https://element-plus.org/zh-CN/component/icon.html) | 2.3.2                                              | <span data-zh="Element Plus 图标库" data-en="Element Plus icons library">Element Plus 图标库</span> |

### <span data-zh="工具库" data-en="Utilities">工具库</span>

| <span data-zh="技术" data-en="Technology">技术</span> | <span data-zh="版本" data-en="Version">版本</span> | <span data-zh="说明" data-en="Description">说明</span>       |
| ----------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| [Axios](https://axios-http.com/)                      | 1.13.2                                             | <span data-zh="HTTP 客户端" data-en="HTTP client">HTTP 客户端</span> |
| [ECharts](https://echarts.apache.org/)                | 6.0.0                                              | <span data-zh="数据可视化图表库" data-en="Data visualization library">数据可视化图表库</span> |
| [Sass](https://sass-lang.com/)                        | 1.97.1                                             | <span data-zh="CSS 预处理器" data-en="CSS preprocessor">CSS 预处理器</span> |

---

## <span data-zh="📁 项目结构" data-en="📁 Project Structure">📁 项目结构</span>

```
ship-management-front/
├── public/                 # <span data-zh="静态资源" data-en="Static assets">静态资源</span>
├── src/
│   ├── api/                # <span data-zh="API 接口" data-en="API interfaces">API 接口</span>
│   │   └── user.js        # <span data-zh="用户相关接口" data-en="User related APIs">用户相关接口</span>
│   ├── assets/             # <span data-zh="资源文件" data-en="Resource files">资源文件</span>
│   ├── components/         # <span data-zh="公共组件" data-en="Shared components">公共组件</span>
│   ├── layout/             # <span data-zh="布局组件" data-en="Layout components">布局组件</span>
│   │   └── AdminLayout.vue # <span data-zh="管理后台布局" data-en="Admin layout">管理后台布局</span>
│   ├── router/             # <span data-zh="路由配置" data-en="Router configuration">路由配置</span>
│   │   └── index.js        # <span data-zh="路由主文件" data-en="Main router file">路由主文件</span>
│   ├── stores/             # <span data-zh="状态管理" data-en="State management">状态管理</span>
│   │   ├── token.js        # <span data-zh="Token 状态" data-en="Token state">Token 状态</span>
│   │   ├── user.js         # <span data-zh="用户状态" data-en="User state">用户状态</span>
│   │   └── theme.js        # <span data-zh="主题状态" data-en="Theme state">主题状态</span>
│   ├── style.css           # <span data-zh="全局样式" data-en="Global styles">全局样式</span>
│   ├── utils/              # <span data-zh="工具函数" data-en="Utility functions">工具函数</span>
│   │   └── request.js      # <span data-zh="Axios 封装" data-en="Axios wrapper">Axios 封装</span>
│   ├── views/              # <span data-zh="页面组件" data-en="Page components">页面组件</span>
│   │   ├── dashboard/      # <span data-zh="仪表盘" data-en="Dashboard">仪表盘</span>
│   │   ├── ship/           # <span data-zh="船舶管理" data-en="Ship management">船舶管理</span>
│   │   ├── category/       # <span data-zh="船舶分类" data-en="Ship categories">船舶分类</span>
│   │   ├── crew/           # <span data-zh="船员管理" data-en="Crew management">船员管理</span>
│   │   ├── voyage/         # <span data-zh="航行记录" data-en="Voyage records">航行记录</span>
│   │   ├── maintenance/    # <span data-zh="维护记录" data-en="Maintenance records">维护记录</span>
│   │   └── user/           # <span data-zh="用户相关" data-en="User related">用户相关</span>
│   ├── App.vue             # <span data-zh="根组件" data-en="Root component">根组件</span>
│   ├── Login.vue           # <span data-zh="登录页面" data-en="Login page">登录页面</span>
│   └── main.js             # <span data-zh="入口文件" data-en="Entry file">入口文件</span>
├── index.html              # <span data-zh="HTML 模板" data-en="HTML template">HTML 模板</span>
├── package.json            # <span data-zh="项目配置" data-en="Project config">项目配置</span>
└── vite.config.js          # <span data-zh="Vite 配置" data-en="Vite config">Vite 配置</span>
```

---

## <span data-zh="🎯 核心功能说明" data-en="🎯 Core Features">🎯 核心功能说明</span>

### <span data-zh="认证系统" data-en="Authentication System">认证系统</span>

<span data-zh="系统采用 JWT Token 认证机制，支持多种登录方式：" data-en="The system uses JWT Token authentication and supports multiple login methods:">系统采用 JWT Token 认证机制，支持多种登录方式：</span>

- <span data-zh="**账号密码登录**：结合图形验证码，确保安全" data-en="**Username/Password Login**: With captcha for security">**账号密码登录**：结合图形验证码，确保安全</span>
- <span data-zh="**邮箱验证码登录**：便捷的邮箱验证登录方式" data-en="**Email Code Login**: Convenient email verification login">**邮箱验证码登录**：便捷的邮箱验证登录方式</span>
- <span data-zh="**自动刷新**：路由守卫自动检测 Token 有效性" data-en="**Auto Refresh**: Route guards automatically validate Token">**自动刷新**：路由守卫自动检测 Token 有效性</span>
- <span data-zh="**安全登出**：清理本地存储的用户信息" data-en="**Secure Logout**: Clears local user data">**安全登出**：清理本地存储的用户信息</span>

```javascript
// <span data-zh="路由守卫示例" data-en="Route guard example">路由守卫示例</span>
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token && !publicPaths.includes(to.path)) {
    return next('/login')
  }
  // <span data-zh="... 其他逻辑" data-en="... other logic">... 其他逻辑</span>
})
```

### <span data-zh="主题系统" data-en="Theme System">主题系统</span>

<span data-zh="内置亮色/暗色主题切换功能，自动持久化用户偏好：" data-en="Built-in light/dark theme toggle with automatic persistence:">内置亮色/暗色主题切换功能，自动持久化用户偏好：</span>

```javascript
// <span data-zh="使用主题切换" data-en="Theme toggle usage">使用主题切换</span>
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
themeStore.toggleTheme()
```

### <span data-zh="数据可视化" data-en="Data Visualization">数据可视化</span>

<span data-zh="使用 ECharts 实现数据可视化，支持多种图表类型：" data-en="Data visualization using ECharts with multiple chart types:">使用 ECharts 实现数据可视化，支持多种图表类型：</span>

- <span data-zh="饼图（船舶状态分布）" data-en="Pie chart (ship status distribution)">饼图（船舶状态分布）</span>
- <span data-zh="柱状图（业务数据统计）" data-en="Bar chart (business data statistics)">柱状图（业务数据统计）</span>
- <span data-zh="折线图（数据趋势）" data-en="Line chart (data trends)">折线图（数据趋势）</span>

---

## <span data-zh="🔧 配置说明" data-en="🔧 Configuration">🔧 配置说明</span>

### <span data-zh="Vite 配置" data-en="Vite Configuration">Vite 配置</span>

<span data-zh="`vite.config.js` 包含以下关键配置：" data-en="`vite.config.js` contains the following key configurations:">`vite.config.js` 包含以下关键配置：</span>

```javascript
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // <span data-zh="路径别名" data-en="Path alias">路径别名</span>
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // <span data-zh="后端地址" data-en="Backend address">后端地址</span>
        changeOrigin: true
      }
    }
  }
})
```

### <span data-zh="请求拦截器" data-en="Request Interceptor">请求拦截器</span>

<span data-zh="Axios 拦截器统一处理请求和响应：" data-en="Axios interceptors handle requests and responses uniformly:">Axios 拦截器统一处理请求和响应：</span>

- <span data-zh="**请求拦截**：自动添加 Token" data-en="**Request Interceptor**: Automatically adds Token">**请求拦截**：自动添加 Token</span>
- <span data-zh="**响应拦截**：统一错误处理、Token 过期处理" data-en="**Response Interceptor**: Unified error handling and Token expiration">**响应拦截**：统一错误处理、Token 过期处理</span>

---

## <span data-zh="📝 开发规范" data-en="📝 Development Standards">📝 开发规范</span>

### <span data-zh="代码风格" data-en="Code Style">代码风格</span>

<span data-zh="项目采用 Vue 3 Composition API 开发模式，推荐使用 `<script setup>` 语法。" data-en="The project uses Vue 3 Composition API. `<script setup>` syntax is recommended.">项目采用 Vue 3 Composition API 开发模式，推荐使用 `<script setup>` 语法。</span>

### <span data-zh="命名规范" data-en="Naming Conventions">命名规范</span>

- <span data-zh="组件文件：PascalCase（如 `UserProfile.vue`）" data-en="Component files: PascalCase (e.g., `UserProfile.vue`)">组件文件：PascalCase（如 `UserProfile.vue`）</span>
- <span data-zh="工具函数：camelCase（如 `formatDate`）" data-en="Utility functions: camelCase (e.g., `formatDate`)">工具函数：camelCase（如 `formatDate`）</span>
- <span data-zh="常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）" data-en="Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)">常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）</span>
- <span data-zh="文件夹：kebab-case（如 `user-profile`）" data-en="Folders: kebab-case (e.g., `user-profile`)">文件夹：kebab-case（如 `user-profile`）</span>

### <span data-zh="Git 提交规范" data-en="Git Commit Convention">Git 提交规范</span>

```
feat: <span data-zh="新功能" data-en="new feature">新功能</span>
fix: <span data-zh="修复 bug" data-en="bug fix">修复 bug</span>
docs: <span data-zh="文档更新" data-en="documentation update">文档更新</span>
style: <span data-zh="代码格式调整" data-en="code format">代码格式调整</span>
refactor: <span data-zh="代码重构" data-en="code refactoring">代码重构</span>
perf: <span data-zh="性能优化" data-en="performance optimization">性能优化</span>
test: <span data-zh="测试相关" data-en="testing">测试相关</span>
chore: <span data-zh="构建/工具相关" data-en="build/tooling">构建/工具相关</span>
```

---

## <span data-zh="🤝 贡献指南" data-en="🤝 Contributing">🤝 贡献指南</span>

<span data-zh="欢迎贡献代码！请遵循以下步骤：" data-en="Contributions are welcome! Please follow these steps:">欢迎贡献代码！请遵循以下步骤：</span>

1. <span data-zh="Fork 本仓库" data-en="Fork this repository">Fork 本仓库</span>
2. <span data-zh="创建特性分支 (`git checkout -b feature/AmazingFeature`)" data-en="Create a feature branch (`git checkout -b feature/AmazingFeature`)">创建特性分支 (`git checkout -b feature/AmazingFeature`)</span>
3. <span data-zh="提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)" data-en="Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)">提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)</span>
4. <span data-zh="推送到分支 (`git push origin feature/AmazingFeature`)" data-en="Push to the branch (`git push origin feature/AmazingFeature`)">推送到分支 (`git push origin feature/AmazingFeature`)</span>
5. <span data-zh="创建 Pull Request" data-en="Open a Pull Request">创建 Pull Request</span>

---

## <span data-zh="📄 许可证" data-en="📄 License">📄 许可证</span>

<span data-zh="本项目采用 [MIT](LICENSE) 许可证。" data-en="This project is licensed under [MIT](LICENSE).">本项目采用 [MIT](LICENSE) 许可证。</span>

---

## <span data-zh="👥 作者" data-en="👥 Author">👥 作者</span>

- <span data-zh="**开发者** - [Dvesiz](https://github.com/Dvesiz)" data-en="**Developer** - [Dvesiz](https://github.com/Dvesiz)">**开发者** - [Dvesiz](https://github.com/Dvesiz)</span>

---

## <span data-zh="🙏 致谢" data-en="🙏 Acknowledgments">🙏 致谢</span>

<span data-zh="感谢以下开源项目：" data-en="Thanks to the following open source projects:">感谢以下开源项目：</span>

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [ECharts](https://echarts.apache.org/)

---

## <span data-zh="📧 联系方式" data-en="📧 Contact">📧 联系方式</span>

<span data-zh="如有问题或建议，欢迎通过以下方式联系：" data-en="For questions or suggestions, feel free to contact:">如有问题或建议，欢迎通过以下方式联系：</span>

- <span data-zh="提交 [Issue](https://github.com/Dvesiz/ship-management-front/issues)" data-en="Submit [Issue](https://github.com/Dvesiz/ship-management-front/issues)">提交 [Issue](https://github.com/Dvesiz/ship-management-front/issues)</span>
- <span data-zh="发送邮件：2207547110@qq.com" data-en="Email: 2207547110@qq.com">发送邮件：2207547110@qq.com</span>

---

<div align="center">


<span data-zh="**如果觉得这个项目对你有帮助，请给一个 ⭐ Star！**" data-en="**If you find this project helpful, please give it a ⭐ Star!**">**如果觉得这个项目对你有帮助，请给一个 ⭐ Star！**</span>

<span data-zh="Made with ❤️ by [Dvesiz]" data-en="Made with ❤️ by [Dvesiz]">Made with ❤️ by [Dvesiz]</span>

</div>

