<template>
  <div class="flex flex-col pb-[60px]">
    <!-- Safe Area Spacer -->
    <div class="h-[44px] bg-white sticky top-0 z-[60]"></div>
    <!-- Mobile Header -->
    <div class="bg-white px-4 py-3 flex items-center justify-between sticky top-[44px] z-10 shadow-sm shadow-gray-100">
      <div class="font-black text-xl text-[#333]">稳当文档</div>
      <div class="flex items-center gap-4">
        <el-icon :size="20" @click="router.push('/m/search')"><Search /></el-icon>
        <el-avatar :size="28" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" @click="router.push('/m/profile')" />
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white px-4 pb-3">
      <div 
        @click="router.push('/m/search')"
        class="bg-[#F6F6F6] h-10 rounded-full flex items-center px-4 gap-2 text-gray-400 text-sm"
      >
        <el-icon><Search /></el-icon>
        <span>输入关键词搜索文档</span>
      </div>
    </div>

    <!-- Banner -->
    <div class="h-[140px] px-4 my-2">
      <el-carousel trigger="click" height="140px" class="rounded-xl overflow-hidden shadow-sm" arrow="never">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <div :class="`h-full w-full flex items-center justify-center text-white font-bold text-lg p-6 ${item.color} relative overflow-hidden`">
            <div class="relative z-10">
               <div class="text-xs opacity-80 mb-1">{{ item.tag }}</div>
               <div>{{ item.title }}</div>
            </div>
            <el-icon class="absolute -right-4 -bottom-4 opacity-10" :size="100"><component :is="item.icon" /></el-icon>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- Grid Menu -->
    <div class="grid grid-cols-4 gap-y-4 py-4 px-2 bg-white">
      <div v-for="item in menuItems" :key="item.name" class="flex flex-col items-center gap-1.5" @click="handleCatClick(item.name)">
        <div :class="`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm ${item.color}`">
           <el-icon :size="20"><component :is="item.icon" /></el-icon>
        </div>
        <span class="text-[11px] text-gray-600 font-medium">{{ item.name }}</span>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="mt-2 bg-white p-4">
      <div class="flex items-center justify-between mb-4">
         <h3 class="font-black text-gray-900 border-l-4 border-[#1890FF] pl-2 leading-none">精彩推荐</h3>
         <span class="text-xs text-gray-400">查看更多</span>
      </div>
      <div class="space-y-4">
        <div 
          v-for="doc in mockDocuments" 
          :key="doc.id" 
          @click="router.push(`/m/detail/${doc.id}`)"
          class="flex gap-3 active:bg-gray-50 transition-colors"
        >
          <div class="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center relative">
             <el-icon :size="32" class="text-gray-300"><Document /></el-icon>
             <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
          </div>
          <div class="flex flex-col flex-1 py-1">
             <div class="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2">{{ doc.title }}</div>
             <div class="mt-auto flex items-center justify-between">
                <div class="flex items-center gap-2">
                   <span class="text-[10px] text-gray-400">{{ (doc as any).downloadCount }} 下载</span>
                   <span class="text-[10px] text-gray-400">{{ (doc as any).pages }} 页</span>
                </div>
                <div class="text-orange-600 font-bold text-sm">¥{{ (doc as any).price }}</div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Tab Bar -->
    <div class="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50 rounded-t-2xl">
      <div 
        v-for="tab in tabs" 
        :key="tab.name"
        class="flex flex-col items-center gap-1 min-w-[60px]"
        :class="activeTab === tab.path ? 'text-[#1890FF]' : 'text-gray-400'"
        @click="handleTabClick(tab)"
      >
        <el-icon :size="20"><component :is="tab.icon" /></el-icon>
        <span class="text-[10px] font-bold">{{ tab.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, Notebook, Files, Document, 
  User, HomeFilled, Trophy, 
  Connection, Opportunity, Star,
  PriceTag, Service, Download
} from '@element-plus/icons-vue'
import { mockDocuments } from '@/mock'

const router = useRouter()
const activeTab = ref('/m/home')

const banners = [
  { id: 1, title: '2026 考研复习大纲', tag: '最新推荐', color: 'bg-blue-500', icon: Notebook },
  { id: 2, title: '高效办公模板集锦', tag: '限时免费', color: 'bg-emerald-500', icon: Files }
]

const menuItems = [
  { name: '考研', icon: Notebook, color: 'bg-[#409EFF]' },
  { name: '公考', icon: Notebook, color: 'bg-[#F56C6C]' },
  { name: '编程', icon: Connection, color: 'bg-[#303133]' },
  { name: '设计', icon: Opportunity, color: 'bg-[#A855F7]' },
  { name: '合同', icon: Files, color: 'bg-[#FF7D00]' },
  { name: '精选', icon: Star, color: 'bg-[#FF9900]' },
  { name: '任务', icon: Trophy, color: 'bg-[#FBC02D]' },
  { name: 'VIP', icon: Download, color: 'bg-[#18181B]' }
]

const tabs = [
  { name: 'home', label: '首页', icon: HomeFilled, path: '/m/home' },
  { name: 'search', label: '发现', icon: Search, path: '/m/search' },
  { name: 'mine', label: '我的', icon: User, path: '/m/profile' }
]

const handleTabClick = (tab: any) => {
  activeTab.value = tab.path
  router.push(tab.path)
}

const handleCatClick = (name: string) => {
  if (name === 'VIP') {
    router.push('/m/vip')
  } else if (name === '任务') {
    router.push('/m/tasks')
  } else {
    router.push({ path: '/m/search', query: { q: name } })
  }
}
</script>
