<script setup>
import { NMessageProvider } from 'naive-ui'
// 不需要在这里引入 Login 了，路由会自动处理
</script>

<template>
  <n-message-provider>
    <router-view />
  </n-message-provider>
</template>

<style scoped>
</style>