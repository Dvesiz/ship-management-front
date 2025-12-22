<script setup>
import { NMessageProvider } from 'naive-ui'
// 注意：这里改为引入当前目录下的 Login.vue
import Login from './Login.vue'
</script>

<template>
  <n-message-provider>
    <Login />
  </n-message-provider>
</template>

<style scoped>
</style>