<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-container h-16 flex items-center justify-between gap-4">
        <!-- Logo -->
        <div class="flex items-center cursor-pointer shrink-0 group" @click="router.push('/')">
          <div class="relative w-10 h-10 flex items-center justify-center">
            <!-- Document Icon Stack -->
            <div class="absolute inset-0 bg-blue-100 rounded-lg rotate-3 group-hover:rotate-6 transition-transform"></div>
            <div class="absolute inset-0 bg-blue-200 rounded-lg -rotate-2 group-hover:-rotate-4 transition-transform"></div>
            <div class="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
               <div class="absolute top-0 right-0 w-4 h-4 bg-white/20 rounded-bl-lg"></div>
               <div class="flex flex-col gap-1.5 px-2 w-full">
                 <div class="h-1 bg-white/40 rounded-full w-3/4"></div>
                 <div class="h-1 bg-white/60 rounded-full w-full"></div>
                 <div class="h-1 bg-white/40 rounded-full w-1/2"></div>
               </div>
            </div>
          </div>
          <div class="flex flex-col ml-3 leading-none">
            <h1 class="text-xl font-black text-gray-900 tracking-tighter hidden sm:block">稳当文档</h1>
            <span class="text-[10px] text-blue-600 font-bold tracking-wider hidden sm:block mt-0.5">文档，就该稳当</span>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl relative">
          <el-autocomplete
            v-model="searchQuery"
            :fetch-suggestions="querySearch"
            placeholder="搜索考研资料、公考真题、合同模板..."
            class="w-full"
            clearable
            @select="handleSelect"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #suffix>
              <el-button type="primary" link @click="handleSearch">搜索</el-button>
            </template>
          </el-autocomplete>
        </div>

        <!-- Right Tools -->
        <div class="flex items-center gap-4 shrink-0">
          <el-button 
            type="warning" 
            class="!bg-gradient-to-r from-yellow-400 to-orange-500 !border-none !text-white font-bold px-6 shadow-lg shadow-yellow-100"
            @click="router.push('/vip')"
          >
            <el-icon class="mr-1"><Trophy /></el-icon>
            VIP 会员
          </el-button>
          
          <el-tooltip
            content="信誉分低于 60 分，暂时无法上传文档"
            placement="bottom"
            :disabled="!currentUser || currentUser.score >= 60"
          >
            <div class="inline-block">
              <el-button 
                type="primary" 
                plain 
                :disabled="currentUser && currentUser.score < 60"
                @click="handleUpload"
              >
                <el-icon class="mr-1"><Upload /></el-icon>
                上传文档
              </el-button>
            </div>
          </el-tooltip>

          <el-button 
            class="!border-blue-100 !bg-blue-50/50 !text-blue-600 hover:!bg-blue-100 hidden lg:flex items-center gap-1.5"
            @click="router.push('/mobile/home')"
          >
            <el-icon><Iphone /></el-icon>
            手机端预览
          </el-button>

          <template v-if="currentUser">
            <el-dropdown trigger="hover" @command="handleCommand">
              <div class="flex items-center gap-2 cursor-pointer">
                <el-avatar :size="32" :src="currentUser.avatar" />
                <span class="text-sm font-medium text-gray-700 hidden md:block">{{ currentUser.nickname }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="uploads">我的上传</el-dropdown-item>
                  <el-dropdown-item command="favorites">我的收藏</el-dropdown-item>
                  <el-dropdown-item command="downloads">我的下载</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <div class="flex items-center gap-2">
              <el-button link @click="handleLogin">登录</el-button>
              <el-divider direction="vertical" />
              <el-button link @click="handleRegister">注册</el-button>
            </div>
          </template>
        </div>
      </div>

      <!-- Categories Tab -->
      <div class="border-t bg-gray-50/50">
        <div class="max-container overflow-x-auto no-scrollbar">
          <div class="flex items-center h-10 justify-between gap-8 whitespace-nowrap min-w-max">
            <div class="flex items-center h-full gap-8">
              <!-- Mega Menu Button -->
              <el-popover
                placement="bottom-start"
                :width="1200"
                trigger="hover"
                popper-class="mega-menu-popper"
                :show-after="100"
                :hide-after="200"
              >
                <template #reference>
                  <div class="flex items-center gap-1.5 text-sm font-bold text-gray-900 cursor-pointer hover:text-blue-600 px-2 h-full border-r pr-6 mr-[-8px]">
                    <el-icon><MenuIcon /></el-icon>
                    文档分类
                  </div>
                </template>

                <!-- Mega Menu Content -->
                <div v-if="categories && categories.length > 0" class="p-8 bg-white relative min-h-[400px]">
                  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-10 gap-x-8">
                    <div v-for="cat in categories" :key="cat.title" class="space-y-4">
                      <div class="flex items-center justify-between group cursor-pointer border-b border-gray-100 pb-2 mb-2" @click="handleTabClick(cat.title)">
                        <h4 class="font-bold text-[15px] text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                          {{ cat.title }}
                        </h4>
                        <el-icon class="text-gray-300 group-hover:text-blue-400 translate-x-[-4px] group-hover:translate-x-0 transition-transform"><ArrowRight /></el-icon>
                      </div>
                      <div class="flex flex-wrap gap-x-3 gap-y-2">
                        <a 
                          v-for="sub in cat.children" 
                          :key="sub" 
                          href="#" 
                          class="text-[13px] text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors whitespace-nowrap"
                          @click.prevent="handleSearchWithCat(sub)"
                        >
                          {{ sub }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
              <div class="flex items-center h-full gap-6">
                <a 
                  v-for="tab in docTabs" 
                  :key="tab"
                  href="#"
                  class="text-sm font-medium transition-colors hover:text-blue-600 h-full flex items-center mt-[1px]"
                  :class="activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' : 'text-gray-600'"
                  @click.prevent="handleTabClick(tab)"
                >
                  {{ tab }}
                </a>
              </div>
            </div>

            <!-- Right side / Service ports -->
            <div class="flex items-center gap-4 border-l pl-6 border-gray-200">
              <span class="text-xs text-gray-400 font-medium">应用与服务:</span>
              <div class="flex items-center gap-2.5">
                <a 
                  v-for="service in serviceTabs" 
                  :key="service"
                  href="#"
                  class="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border transition-all duration-200 hover:shadow-xs"
                  :class="{
                    'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700': service === '任务广场',
                    'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700': service === '个人认证',
                    'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700': service === '企业认证'
                  }"
                  @click.prevent="handleTabClick(service)"
                >
                  <el-icon class="text-[11px]">
                    <Trophy v-if="service === '任务广场'" />
                    <Iphone v-else-if="service === '个人认证'" />
                    <MenuIcon v-else-if="service === '企业认证'" />
                  </el-icon>
                  {{ service }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-container py-4">
      <!-- Breadcrumb -->
      <el-breadcrumb :separator-icon="ArrowRight" class="mb-4">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <!-- Page Content -->
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t py-12 mt-auto">
      <div class="max-container">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center mb-6 cursor-pointer group" @click="router.push('/')">
              <div class="relative w-8 h-8 flex items-center justify-center">
                <div class="absolute inset-0 bg-blue-100 rounded-md rotate-3"></div>
                <div class="relative w-full h-full bg-blue-600 rounded-md shadow-sm flex items-center justify-center overflow-hidden">
                  <div class="absolute top-0 right-0 w-3 h-3 bg-white/20 rounded-bl-md"></div>
                  <div class="flex flex-col gap-1 px-1.5 w-full">
                    <div class="h-0.5 bg-white/40 rounded-full w-3/4"></div>
                    <div class="h-0.5 bg-white/60 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
              <div class="ml-3 leading-none">
                <h3 class="text-lg font-black text-gray-900 tracking-tight">稳当文档</h3>
                <p class="text-[8px] text-gray-400 font-mono tracking-widest">WENDANG.COM</p>
              </div>
            </div>
            <p class="text-sm text-gray-500 max-w-md leading-relaxed">
              致力于打造最专业、最安全、最便捷的学术与职场文档共享平台。
              在这里，每一份文档都有价值。
            </p>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider cursor-pointer hover:text-blue-600" @click="router.push('/help')">帮助中心</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-blue-600">上传指南</a></li>
              <li><a href="#" class="hover:text-blue-600">收益说明</a></li>
              <li><a href="#" class="hover:text-blue-600">信誉分规则</a></li>
              <li><a href="#" class="hover:text-blue-600">联系我们</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">法律协议</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-blue-600">服务协议</a></li>
              <li><a href="#" class="hover:text-blue-600">隐私政策</a></li>
              <li><a href="#" class="hover:text-blue-600">版权保护</a></li>
              <li><a href="#" class="hover:text-blue-600">举报指引</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2024 稳当文档 版权所有</p>
          <div class="flex items-center gap-4">
            <span>京ICP备2023000001号-1</span>
            <span>京公网安备11000002000001号</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, Upload, ArrowRight, Trophy, Iphone, Menu as MenuIcon, Close } from '@element-plus/icons-vue'
import { useMainStore } from '../store'
import { ElMessage } from 'element-plus'
import { categories } from '../utils/categories'

const router = useRouter()
const route = useRoute()
const userStore = useMainStore()
const currentUser = computed(() => userStore.user)

const searchQuery = ref('')
const activeTab = ref('全部')
const docTabs = ['全部', '考研', '公考', '编程', '设计', '合同', '热门', '最新']
const serviceTabs = ['任务广场', '个人认证', '企业认证']

const handleSearchWithCat = (cat: string) => {
  router.push({ path: '/search', query: { q: cat } })
}

const handleTabClick = (tab: string) => {
  if (tab === '任务广场') {
    router.push({ name: '任务广场' })
  } else if (tab === '个人认证') {
    router.push('/certification')
  } else if (tab === '企业认证') {
    router.push('/enterprise-certification')
  } else {
    activeTab.value = tab
    if (route.path !== '/') router.push('/')
  }
}

// Breadcrumbs logic
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(m => m.name && m.name !== 'PC')
  return matched.map(m => ({
    name: m.name as string,
    path: m.path
  }))
})

// Search suggestions
const querySearch = (queryString: string, cb: any) => {
  const suggestions = [
    { value: '2026考研英语真题' },
    { value: 'Java后端开发手册' },
    { value: '离职补偿协议模版' },
    { value: '申论高分范文集' },
    { value: 'UI设计入门教程' }
  ]
  const results = queryString
    ? suggestions.filter(i => i.value.toLowerCase().includes(queryString.toLowerCase()))
    : suggestions
  cb(results)
}

const handleSearch = () => {
  if (!searchQuery.value) return
  router.push({ path: '/search', query: { q: searchQuery.value } })
}

const handleSelect = (item: any) => {
  searchQuery.value = item.value
  handleSearch()
}

const handleUpload = () => {
  if (!currentUser.value) {
    ElMessage.warning('请先登录后再进行上传')
    router.push('/login')
    return
  }
  if (currentUser.value.score < 60) {
    ElMessage.error('当前信誉分不足，暂时无法上传')
    return
  }
  router.push('/upload')
}

const handleLogin = () => {
  router.push('/login')
}

const handleRegister = () => {
  router.push('/register')
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
    case 'uploads':
    case 'favorites':
    case 'downloads':
      router.push('/profile')
      break
    case 'logout':
      userStore.logout()
      ElMessage.info('已退出登录')
      router.push('/')
      break
    default:
      ElMessage.info(`跳转: ${command}`)
  }
}
</script>

<style>
.mega-menu-popper {
  padding: 0 !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid #f3f4f6 !important;
}
</style>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
