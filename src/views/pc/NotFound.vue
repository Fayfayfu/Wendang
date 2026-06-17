<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center p-4">
    <div class="text-9xl font-black text-gray-100 mb-4 select-none">404</div>
    <h1 class="text-3xl font-black text-gray-900 mb-4">页面走丢了</h1>
    <p class="text-gray-400 mb-8 max-w-md text-center">抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回首页。</p>
    <el-button type="primary" class="!px-8 !h-12 !rounded-full font-bold" @click="router.push('/')">
      返回首页
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
