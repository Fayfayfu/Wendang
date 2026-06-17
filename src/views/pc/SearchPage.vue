<template>
  <AppLayout>
    <div class="flex gap-8 py-6">
      <!-- 侧边栏筛选 -->
      <aside class="w-64 shrink-0 space-y-8">
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 class="font-bold mb-4 text-gray-900">文档分类</h3>
          <el-checkbox-group v-model="selectedCategories" class="flex flex-col gap-3">
            <el-checkbox v-for="cat in categories" :key="cat" :label="cat" :value="cat">
              {{ cat }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 class="font-bold mb-4 text-gray-900">价格区间</h3>
          <el-radio-group v-model="selectedPriceRange" class="flex flex-col gap-3">
            <el-radio label="全部" value="全部">全部价格</el-radio>
            <el-radio label="免费" value="免费">免费文档</el-radio>
            <el-radio label="0-10" value="0-10">¥0 - ¥10</el-radio>
            <el-radio label="10-30" value="10-30">¥10 - ¥30</el-radio>
            <el-radio label="30+" value="30+">¥30 以上</el-radio>
          </el-radio-group>
        </div>

        <div class="bg-blue-50 p-4 rounded-xl text-center">
          <p class="text-xs text-blue-600 mb-2">没找到想要的？</p>
          <el-button type="primary" size="small" plain>发布悬赏任务</el-button>
        </div>
      </aside>

      <!-- 右侧内容 -->
      <main class="flex-1">
        <!-- 搜索状态 -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6 flex items-center justify-between">
          <div class="flex items-baseline gap-2">
            <span class="text-sm text-gray-500">找到关于</span>
            <span class="text-lg font-bold text-blue-600">"{{ keyword }}"</span>
            <span class="text-sm text-gray-500">的 {{ totalItems }} 个结果</span>
          </div>
          
          <el-tabs v-model="activeType" class="type-tabs">
            <el-tab-pane label="文档" name="doc" />
            <el-tab-pane label="文集" name="collection" />
          </el-tabs>
        </div>

        <!-- 排序过滤 -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-6">
            <span 
              v-for="sort in sortOptions" 
              :key="sort.value"
              class="text-sm cursor-pointer transition-colors"
              :class="currentSort === sort.value ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'"
              @click="currentSort = sort.value"
            >
              {{ sort.label }}
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <el-switch v-model="onlyVip" active-text="VIP 免费" size="small" />
          </div>
        </div>

        <!-- 结果列表 -->
        <div v-if="filteredItems.length > 0">
          <el-row :gutter="20">
            <el-col 
              v-for="item in pagedItems" 
              :key="item.id" 
              :span="6" 
              class="mb-6"
            >
              <!-- 文档卡片 -->
              <div v-if="activeType === 'doc'" class="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer" @click="router.push(`/document/${item.id}`)">
                <div class="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img :src="item.cover" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <el-button type="primary" circle><el-icon><View /></el-icon></el-button>
                  </div>
                </div>
                <div class="p-3">
                  <h4 class="text-sm font-bold line-clamp-2 h-10 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {{ item.title }}
                  </h4>
                  <div class="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                    <span>{{ item.category }} | {{ item.format }}</span>
                    <span class="text-orange-600 font-bold" v-if="item.price > 0">¥{{ item.price }}</span>
                    <span class="text-green-600 font-bold" v-else>免费</span>
                  </div>
                  <div class="flex items-center justify-between text-[10px] text-gray-400 border-t pt-2">
                     <div class="flex items-center gap-1">
                       <el-icon><Download /></el-icon>{{ item.downloadCount }}
                     </div>
                     <div class="flex items-center gap-1">
                       <el-icon><StarFilled /></el-icon>{{ item.rating }}
                     </div>
                  </div>
                </div>
              </div>

              <!-- 文集卡片 -->
              <div v-else class="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer" @click="router.push(`/collection/${item.id}`)">
                 <div class="aspect-video bg-gray-200 relative">
                   <img :src="item.cover" class="w-full h-full object-cover" />
                   <div class="absolute bottom-0 inset-x-0 p-2 bg-black/50 text-white text-[10px] flex justify-between">
                     <span>{{ item.docCount }} 个文档</span>
                     <span>¥{{ item.price }}</span>
                   </div>
                 </div>
                 <div class="p-3">
                   <h4 class="text-sm font-bold truncate group-hover:text-blue-600">{{ item.title }}</h4>
                   <p class="text-xs text-gray-400 mt-1 line-clamp-1 italic">「{{ item.description }}」</p>
                 </div>
              </div>
            </el-col>
          </el-row>

          <!-- 分页 -->
          <div class="mt-12 flex justify-center">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="totalItems"
              layout="prev, pager, next"
              background
            />
          </div>
        </div>

        <!-- 无结果 -->
        <div v-else class="py-20 text-center">
          <el-empty description="没有找到相关结果" />
        </div>
      </main>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { View, Download, StarFilled } from '@element-plus/icons-vue'
import { mockDocuments, mockCollections } from '@/mock'

const route = useRoute()
const router = useRouter()
const keyword = computed(() => (route.query.q as string) || '')

const activeType = ref<'doc' | 'collection'>('doc')
const currentPage = ref(1)
const pageSize = ref(12)
const onlyVip = ref(false)

const categories = ['考研', '公考', '编程', '设计', '合同']
const selectedCategories = ref<string[]>([])
const selectedPriceRange = ref('全部')

const currentSort = ref((route.query.sort as string) || 'relevant')
const sortOptions = [
  { label: '综合排序', value: 'relevant' },
  { label: '最多下载', value: 'downloads' },
  { label: '最新上传', value: 'newest' },
  { label: '价格从低到高', value: 'priceAsc' }
]

// 过滤后的数据
const filteredItems = computed(() => {
  let source: any[] = activeType.value === 'doc' ? mockDocuments : mockCollections
  
  // 关键词搜索
  let result = source.filter(i => 
    i.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
    (i.description && i.description.toLowerCase().includes(keyword.value.toLowerCase()))
  )

  // 类型筛选
  if (activeType.value === 'doc' && selectedCategories.value.length > 0) {
    result = result.filter(i => selectedCategories.value.includes(i.category))
  }

  // 价格筛选
  if (selectedPriceRange.value !== '全部') {
    result = result.filter(i => {
      const p = i.price
      if (selectedPriceRange.value === '免费') return p === 0
      if (selectedPriceRange.value === '0-10') return p > 0 && p <= 10
      if (selectedPriceRange.value === '10-30') return p > 10 && p <= 30
      if (selectedPriceRange.value === '30+') return p > 30
      return true
    })
  }

  // 排序
  result = [...result].sort((a, b) => {
    switch (currentSort.value) {
      case 'downloads':
        return (b.downloadCount || b.totalDownloads || 0) - (a.downloadCount || a.totalDownloads || 0)
      case 'newest':
        return (new Date(b.uploadTime || b.createdAt).getTime()) - (new Date(a.uploadTime || a.createdAt).getTime())
      case 'priceAsc':
        return a.price - b.price
      default:
        return 0
    }
  })

  return result
})

const totalItems = computed(() => filteredItems.value.length)

// 分页数据
const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

// 重置分页
watchEffect(() => {
  keyword.value
  activeType.value
  selectedCategories.value
  selectedPriceRange.value
  currentSort.value
  currentPage.value = 1
})

// 监听路由参数变化更新排序
watchEffect(() => {
  if (route.query.sort) {
    currentSort.value = route.query.sort as string
  }
})
</script>

<style scoped>
:deep(.type-tabs .el-tabs__header) {
  margin: 0;
  border-bottom: none;
}
:deep(.type-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.type-tabs .el-tabs__item) {
  font-weight: bold;
}
</style>
