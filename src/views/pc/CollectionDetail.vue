<template>
  <AppLayout v-if="collection">
    <div class="max-w-6xl mx-auto py-12 px-4">
      <!-- Collection Header -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mb-12">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-72 shrink-0 bg-gray-50 border-r border-gray-100 p-8 flex items-center justify-center">
            <div class="w-48 h-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative group">
              <img :src="collection.cover" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/5 flex items-center justify-center">
                <el-icon :size="48" class="text-white/50"><Collection /></el-icon>
              </div>
            </div>
          </div>
          <div class="flex-1 p-10">
            <div class="flex flex-wrap items-center gap-2 mb-4">
              <el-tag type="primary" effect="dark" class="rounded-full">精品文集</el-tag>
              <el-tag type="info" class="rounded-full">共 {{ collection.docCount }} 个文档</el-tag>
            </div>
            <h1 class="text-3xl font-black text-gray-900 mb-4">{{ collection.title }}</h1>
            <p class="text-gray-500 mb-8 leading-relaxed max-w-2xl">{{ collection.description }}</p>
            
            <div class="flex items-center gap-12 mb-10 pb-10 border-b border-gray-100">
               <div>
                 <p class="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">文集总额</p>
                 <div class="flex items-baseline gap-1">
                   <span class="text-sm font-bold text-orange-600">¥</span>
                   <span class="text-4xl font-black text-orange-600 italic">{{ collection.price }}</span>
                   <div class="ml-2 flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded text-[10px] text-yellow-700 font-bold border border-yellow-100">
                      <el-icon><Star /></el-icon> VIP 享 5 折
                   </div>
                 </div>
               </div>
               <div>
                 <p class="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">累计下载</p>
                 <div class="text-xl font-bold">{{ collection.totalDownloads }}+</div>
               </div>
               <div class="hidden sm:block">
                 <p class="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">最后更新</p>
                 <div class="text-sm font-bold">2026-05-18</div>
               </div>
            </div>

            <div class="flex items-center gap-4">
               <el-button 
                type="primary" 
                size="large" 
                class="px-12 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-200"
                @click="handlePurchase"
               >
                 {{ hasPurchased ? '立即下载文集' : `购买文集 ¥${collection.price}` }}
               </el-button>
               <el-button 
                size="large" 
                class="px-8 h-14 rounded-2xl font-bold border-gray-200"
                @click="previewVisible = true"
               >
                预览前 3 篇
               </el-button>
               <el-button size="large" :icon="Star" circle class="h-14 w-14" />
               <el-button size="large" :icon="Share" circle class="h-14 w-14" />
            </div>
          </div>
        </div>
      </div>

      <!-- Docs List -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-3 space-y-8">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div class="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <h3 class="font-bold text-gray-900">文献目录列表 ({{ collection.docs?.length || 0 }})</h3>
                <div class="flex gap-4">
                   <el-button link type="primary" size="small">批量下载</el-button>
                </div>
             </div>
             <div class="p-4 space-y-2">
                <div 
                  v-for="(doc, idx) in collection.docs" 
                  :key="doc.id"
                  class="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer"
                  @click="router.push(`/document/${doc.id}`)"
                >
                  <div class="w-8 flex-shrink-0 text-center font-black text-gray-200 italic group-hover:text-blue-200">{{ idx + 1 }}</div>
                  <div class="w-10 h-14 bg-gray-100 rounded border overflow-hidden shrink-0">
                    <img :src="doc.cover" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 mb-1">{{ doc.title }}</h4>
                    <div class="flex items-center gap-3 text-[10px] text-gray-400">
                      <span>{{ doc.format.toUpperCase() }}</span>
                      <span>{{ doc.pages }} 页</span>
                      <span>{{ doc.downloadCount }} 次下载</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-bold text-gray-600">¥ {{ (doc.price / 10).toFixed(2) }}</p>
                    <p class="text-[10px] text-gray-400 line-through">¥ {{ (doc.price / 5).toFixed(2) }}</p>
                  </div>
                  <el-button link type="primary" class="opacity-0 group-hover:opacity-100 ml-4">查看详情</el-button>
                </div>
             </div>
          </div>

          <!-- User Ratings Area -->
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 class="font-bold text-gray-900 mb-8">用户评价 (24)</h3>
            <div class="flex items-center gap-12 mb-10 pb-10 border-b border-gray-50">
               <div class="text-center">
                 <h4 class="text-4xl font-black text-gray-900 mb-1">5.0</h4>
                 <el-rate v-model="ratingValue" disabled />
                 <p class="text-[10px] text-gray-400 mt-2">12 人评价</p>
               </div>
               <div class="flex-1 space-y-2">
                 <div v-for="i in 5" :key="i" class="flex items-center gap-4">
                    <span class="text-xs text-gray-400 w-8">{{ 6-i }}星</span>
                    <el-progress :percentage="i === 1 ? 95 : 2" :show-text="false" class="flex-1" :color="i === 1 ? '#FBBF24' : '#E5E7EB'" />
                 </div>
               </div>
            </div>
            
            <div class="space-y-8">
               <div v-for="i in 3" :key="i" class="flex gap-4">
                  <el-avatar :size="40" :src="`https://i.pravatar.cc/150?u=${i}`" />
                  <div class="flex-1">
                     <div class="flex justify-between items-center mb-1">
                        <span class="text-sm font-bold text-gray-900">用户_{{ i * 123 }}</span>
                        <span class="text-[10px] text-gray-400">2026-05-18</span>
                     </div>
                     <el-rate :model-value="5" disabled size="small" class="mb-2" />
                     <p class="text-sm text-gray-600 leading-relaxed">非常实货的资料包，帮我节省了很多整理时间，推荐购买！</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Author -->
        <div class="space-y-6">
           <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center">
              <div class="relative inline-block mb-4">
                <el-avatar :size="80" :src="uploader?.avatar" />
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <el-icon class="text-white" :size="12"><Check /></el-icon>
                </div>
              </div>
              <h4 class="font-bold text-gray-900 mb-1">{{ uploader?.nickname }}</h4>
              <div class="flex justify-center gap-2 mb-4">
                <el-tag size="small" type="info" class="rounded-full">认证作者</el-tag>
                <el-tag size="small" type="success" class="rounded-full">{{ uploader?.score }} 信誉分</el-tag>
              </div>
              <div class="grid grid-cols-2 gap-4 mb-6 text-center border-t border-gray-50 pt-4">
                <div>
                  <p class="text-xs font-bold text-gray-900">1.2w</p>
                  <p class="text-[10px] text-gray-400">关注者</p>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900">842</p>
                  <p class="text-[10px] text-gray-400">文档</p>
                </div>
              </div>
              <div class="flex gap-3">
                 <el-button type="primary" class="flex-1 rounded-xl font-bold">关注作者</el-button>
                 <el-button class="flex-1 rounded-xl font-bold">私信</el-button>
              </div>
           </div>
           
           <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white text-center shadow-xl">
              <el-icon class="text-yellow-400 mb-3" :size="32"><Trophy /></el-icon>
              <h5 class="font-bold mb-2">开通 VIP</h5>
              <p class="text-[10px] text-gray-400 mb-6">全站 10,000+ 文集享 5 折优惠</p>
              <el-button type="warning" class="w-full rounded-xl font-bold" @click="router.push('/vip')">立即省钱</el-button>
           </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      v-model:visible="paymentVisible"
      :title="collection.title"
      :price="collection.price"
      @success="handlePaySuccess"
    />

    <!-- Preview Modal -->
    <el-dialog v-model="previewVisible" title="文集部分预览" width="800" align-center>
      <div class="space-y-12 py-4 max-h-[600px] overflow-y-auto px-4">
         <div v-for="i in 3" :key="i" class="border-b pb-8 last:border-0 border-dashed">
            <h4 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <el-tag type="info" size="small" effect="plain" class="rounded-full">文档 {{ i }}</el-tag>
               <span class="truncate">{{ collection.docs?.[i-1]?.title || '加载中...' }}</span>
            </h4>
            <div class="aspect-[21/9] bg-gray-50 border rounded-2xl flex items-center justify-center overflow-hidden relative group">
               <img v-if="collection.docs?.[i-1]" :src="collection.docs?.[i-1]?.cover" class="w-full h-full object-cover blur-[1px] opacity-30" />
               <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-sm">
                  <el-icon :size="40" class="text-gray-400 mb-3"><Document /></el-icon>
                  <p class="text-xs text-gray-500 font-medium">预览中... </p>
                  <p class="text-[10px] text-gray-400 mt-1">剩余内容购买文集后可查看全文</p>
               </div>
            </div>
         </div>
      </div>
      <template #footer>
         <div class="flex justify-center pb-4 pt-4 border-t">
            <el-button type="primary" size="large" class="px-16 rounded-2xl font-black italic shadow-xl shadow-blue-100" @click="handlePurchase">
              立即购买全集解锁
            </el-button>
         </div>
      </template>
    </el-dialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import PaymentModal from '@/components/PaymentModal.vue'
import { Collection, Share, Star, Trophy, Check, Document } from '@element-plus/icons-vue'
import { mockCollections, mockUsers } from '@/mock'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const colId = computed(() => route.params.id as string)
const collection = computed(() => mockCollections.find(c => c.id === colId.value))

const uploader = computed(() => {
  return mockUsers.find(u => u.id === collection.value?.userId) || mockUsers[0]
})

const paymentVisible = ref(false)
const previewVisible = ref(false)
const hasPurchased = ref(false)
const ratingValue = ref(5)

const handlePurchase = () => {
  if (hasPurchased.value) {
    ElMessage.info('您已购买该文集')
    return
  }
  paymentVisible.value = true
}

const handlePaySuccess = () => {
  hasPurchased.value = true
}
</script>
