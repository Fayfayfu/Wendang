<template>
  <div class="flex flex-col min-h-full bg-[#F5F5F5] pb-[80px]">
    <!-- Safe Area Spacer -->
    <div class="h-[44px] bg-white sticky top-0 z-[60]"></div>
    <!-- User Header -->
    <div class="px-6 pt-4 pb-10 bg-white flex items-center gap-4 relative overflow-hidden">
       <!-- Background Decoration -->
       <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
       
       <el-avatar :size="64" :src="mainStore.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'" class="border-2 border-white shadow-sm shrink-0" />
       <div class="relative z-10 flex-1">
          <div class="flex items-center gap-2 mb-1">
             <h2 class="text-xl font-black text-gray-900">{{ mainStore.user?.nickname || '未登录' }}</h2>
             <div v-if="mainStore.user?.isVip" class="px-1.5 py-0.5 bg-yellow-400 text-gray-900 rounded-md text-[9px] font-bold">超级VIP</div>
             <div v-else class="px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md text-[9px] font-bold">普通用户</div>
          </div>
          <p class="text-xs text-gray-400">ID: {{ mainStore.user?.id || '---' }} · 信誉分: {{ mainStore.user?.score || 100 }}</p>
       </div>
       <el-icon class="text-gray-300" :size="20"><ArrowRight /></el-icon>
    </div>

    <!-- Stats Row -->
    <div class="px-4 -mt-4 relative z-10">
       <div class="bg-white rounded-2xl shadow-sm border border-gray-50 p-4 flex items-center justify-between divide-x divide-gray-100">
          <div class="flex-1 text-center">
             <div class="text-lg font-black text-gray-900">12</div>
             <div class="text-[10px] text-gray-400">下载</div>
          </div>
          <div class="flex-1 text-center">
             <div class="text-lg font-black text-gray-900">45</div>
             <div class="text-[10px] text-gray-400">收藏</div>
          </div>
          <div class="flex-1 text-center">
             <div class="text-lg font-black text-gray-900">3</div>
             <div class="text-[10px] text-gray-400">上传</div>
          </div>
          <div class="flex-1 text-center">
             <div class="text-lg font-black text-gray-900">682</div>
             <div class="text-[10px] text-gray-400">积分</div>
          </div>
       </div>
    </div>

    <!-- VIP Banner -->
    <div class="px-4 mt-4">
       <div 
         @click="router.push('/m/vip')"
         class="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden"
       >
          <div class="relative z-10">
             <div class="flex items-center gap-2 mb-1">
                <el-icon class="text-amber-500" :size="18"><Trophy /></el-icon>
                <span class="text-sm font-black text-white">开通高级会员</span>
             </div>
             <p class="text-white/40 text-[10px]">尊享每日 10 次免费下载权限</p>
          </div>
          <button class="relative z-10 px-3 py-1.5 bg-amber-500 text-gray-900 text-[11px] font-bold rounded-lg shadow-lg shadow-amber-500/20">
             立即开通
          </button>
       </div>
    </div>

    <!-- Menu List -->
    <div class="px-4 mt-4 space-y-3">
       <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
          <div v-for="(item, idx) in mainMenus" :key="item.label" class="group">
             <div class="flex items-center gap-4 px-4 py-4 active:bg-gray-50 transition-colors">
                <div :class="`w-8 h-8 rounded-xl flex items-center justify-center text-white ${item.color}`">
                   <el-icon :size="18"><component :is="item.icon" /></el-icon>
                </div>
                <span class="text-sm font-bold text-gray-800 flex-1">{{ item.label }}</span>
                <span v-if="item.extra" class="text-xs text-gray-400 mr-1">{{ item.extra }}</span>
                <el-icon class="text-gray-300" :size="16"><ArrowRight /></el-icon>
             </div>
             <div v-if="idx < mainMenus.length - 1" class="ml-16 border-b border-gray-50"></div>
          </div>
       </div>

       <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
          <div v-for="(item, idx) in subMenus" :key="item.label" class="group">
             <div class="flex items-center gap-4 px-4 py-4 active:bg-gray-50 transition-colors">
                <div :class="`w-8 h-8 rounded-xl flex items-center justify-center text-white ${item.color}`">
                   <el-icon :size="18"><component :is="item.icon" /></el-icon>
                </div>
                <span class="text-sm font-bold text-gray-800 flex-1">{{ item.label }}</span>
                <el-icon class="text-gray-300" :size="16"><ArrowRight /></el-icon>
             </div>
             <div v-if="idx < subMenus.length - 1" class="ml-16 border-b border-gray-50"></div>
          </div>
       </div>
    </div>

    <!-- Login Out -->
    <div class="px-4 mt-6">
       <button 
         @click="handleLogout"
         class="w-full h-12 bg-white text-[#f5222d] font-bold text-sm rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition-colors"
       >
          退出当前账号
       </button>
    </div>

    <!-- Bottom Tab Bar Copied from Home -->
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
  ArrowRight, Download, Star, Upload, 
  Trophy, Wallet, CircleCheckFilled, Setting, 
  Service, HomeFilled, Search, User
} from '@element-plus/icons-vue'
import { useMainStore } from '@/store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const mainStore = useMainStore()
const activeTab = ref('/m/profile')

const handleLogout = () => {
  mainStore.logout()
  ElMessage.success('已退出登录')
  router.push('/mobile/home')
}

const mainMenus = [
  { label: '我的下载', icon: Download, color: 'bg-blue-500', extra: '12份' },
  { label: '我的收藏', icon: Star, color: 'bg-orange-500', extra: '45个' },
  { label: '我的上传', icon: Upload, color: 'bg-emerald-500' },
  { label: '任务奖励', icon: Trophy, color: 'bg-yellow-500' }
]

const subMenus = [
  { label: '收益零钱', icon: Wallet, color: 'bg-rose-500' },
  { label: '信誉中心', icon: CircleCheckFilled, color: 'bg-indigo-500' },
  { label: '意见反馈', icon: Service, color: 'bg-cyan-500' },
  { label: '系统设置', icon: Setting, color: 'bg-gray-500' }
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
</script>
