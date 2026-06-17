<template>
  <div class="flex flex-col min-h-full bg-white">
    <!-- Safe Area Spacer -->
    <div class="h-[44px] bg-white sticky top-0 z-[60]"></div>
    <!-- Mobile Search Header -->
    <div class="px-4 py-2 flex items-center gap-3 sticky top-[44px] z-10 bg-white">
      <el-icon :size="20" @click="router.back()" class="cursor-pointer"><ArrowLeft /></el-icon>
      <div class="flex-1 bg-gray-100 h-9 rounded-full px-4 flex items-center gap-2">
         <el-icon class="text-gray-400"><Search /></el-icon>
         <input 
           ref="inputRef"
           v-model="searchQuery" 
           placeholder="搜索全站文档" 
           class="bg-transparent border-none outline-none text-sm w-full"
           @keyup.enter="handleSearch"
         />
         <el-icon v-if="searchQuery" class="text-gray-400" @click="searchQuery = ''"><CircleClose /></el-icon>
      </div>
      <span class="text-sm font-bold text-[#1890FF]" @click="handleSearch">搜索</span>
    </div>

    <!-- History / Popular -->
    <div v-if="!isSearching" class="px-5 py-6">
      <div v-if="history.length > 0" class="mb-8">
        <div class="flex items-center justify-between mb-4">
           <h4 class="font-black text-gray-900">搜索历史</h4>
           <el-icon class="text-gray-300" @click="history = []"><Delete /></el-icon>
        </div>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="item in history" 
            :key="item" 
            @click="quickSearch(item)"
            class="px-3 py-1 bg-gray-100 rounded-lg text-xs text-gray-600"
          >
            {{ item }}
          </span>
        </div>
      </div>

      <div>
        <h4 class="font-black text-gray-900 mb-4">热门搜索</h4>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="item in hotTopics" 
            :key="item" 
            @click="quickSearch(item)"
            class="px-3 py-1.5 bg-blue-50/50 text-[#1890FF] rounded-lg text-xs font-medium border border-blue-100/50"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div v-else class="flex-1 bg-[#F5F5F5]">
      <div class="bg-white border-b border-gray-100 flex items-center h-10 px-4 gap-6">
        <span 
          v-for="opt in sortOptions" 
          :key="opt.value"
          @click="currentSort = opt.value"
          class="text-xs transition-colors"
          :class="currentSort === opt.value ? 'text-[#1890FF] font-bold' : 'text-gray-400'"
        >
          {{ opt.label }}
        </span>
      </div>

      <div class="p-4 space-y-3">
        <div 
          v-for="doc in results" 
          :key="doc.id"
          @click="router.push(`/m/detail/${doc.id}`)"
          class="bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-gray-100"
        >
          <div class="w-16 h-20 bg-gray-50 rounded shrink-0 flex items-center justify-center">
             <el-icon :size="28" class="text-gray-200"><Document /></el-icon>
          </div>
          <div class="flex-1 flex flex-col justify-between py-0.5">
            <div class="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
              {{ doc.title }}
            </div>
            <div class="flex items-center justify-between mt-auto">
               <span class="text-[10px] text-gray-400">{{ (doc as any).downloadCount }}次下载 · {{ (doc as any).uploadTime }}</span>
               <span class="text-[#f5222d] font-black text-xs">¥{{ (doc as any).price }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="results.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-300">
         <el-icon :size="64"><Search /></el-icon>
         <p class="mt-4 text-sm font-medium">未找到相关结果</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Search, CircleClose, Delete, Document } from '@element-plus/icons-vue'
import { mockDocuments } from '@/mock'

const router = useRouter()
const route = useRoute()
const searchQuery = ref((route.query.q as string) || '')
const isSearching = ref(!!searchQuery.value)
const inputRef = ref<HTMLInputElement | null>(null)

const history = ref(['考研英语', 'PPT模板', '项目计划书'])
const hotTopics = ['毕业论文', 'Java面试题', '合同示范文本', '会计分录', '手抄报', '商业计划书']

const currentSort = ref('relevant')
const sortOptions = [
  { label: '综合', value: 'relevant' },
  { label: '最新', value: 'newest' },
  { label: '下载最多', value: 'downloads' }
]

const results = computed(() => {
  if (!isSearching.value) return []
  return mockDocuments.filter(d => 
    d.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  isSearching.value = true
  if (!history.value.includes(searchQuery.value)) {
    history.value.unshift(searchQuery.value)
  }
}

const quickSearch = (q: string) => {
  searchQuery.value = q
  handleSearch()
}

onMounted(() => {
  if (!searchQuery.value) {
    inputRef.value?.focus()
  }
})
</script>
