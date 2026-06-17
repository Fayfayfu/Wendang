<template>
  <div class="flex flex-col min-h-full bg-[#F5F5F5] pb-[80px]">
    <!-- Safe Area Spacer -->
    <div class="h-[44px] bg-white/80 backdrop-blur-md sticky top-0 z-[60]"></div>
    <!-- Mobile Header -->
    <div class="bg-white/80 backdrop-blur-md px-4 py-2 flex items-center justify-between sticky top-[44px] z-50 shadow-sm shadow-gray-100/20">
      <el-icon :size="20" @click="router.back()" class="cursor-pointer"><ArrowLeft /></el-icon>
      <span class="text-sm font-black text-gray-800 line-clamp-1 max-w-[200px]">文档详情</span>
      <el-icon :size="20" class="text-gray-600"><Share /></el-icon>
    </div>

    <!-- Preview -->
    <div class="bg-white p-4">
      <div class="aspect-[3/4] bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div class="text-center">
           <el-icon :size="80" class="text-gray-200"><Document /></el-icon>
           <p class="text-xs text-gray-400 mt-4">正文共有 {{ document?.pages }} 页，以下为预览内容</p>
        </div>
        <!-- Watermark -->
        <div class="absolute inset-0 grid grid-cols-2 grid-rows-3 opacity-[0.03] pointer-events-none rotate-[-30deg] scale-125">
           <div v-for="i in 6" :key="i" class="flex items-center justify-center font-black text-4xl">稳当</div>
        </div>
      </div>
      
      <div class="mt-6">
        <h1 class="text-lg font-black text-gray-900 leading-tight mb-2">{{ (document as any)?.title }}</h1>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-400">{{ (document as any)?.downloadCount }}次下载</span>
          <span class="text-xs text-gray-400">{{ (document as any)?.pages }}页</span>
          <span class="text-xs text-gray-400">{{ (document as any)?.uploadTime }}</span>
        </div>
      </div>
    </div>

    <!-- Stats & Price -->
    <div class="mt-3 bg-white p-4">
       <div class="flex items-center justify-between">
          <div>
             <span class="text-gray-400 text-xs">文档价格</span>
             <div class="flex items-baseline gap-1 mt-0.5">
                <span class="text-2xl font-black text-[#f5222d]">¥{{ (document as any)?.price }}</span>
                <span v-if="(document as any)?.price && (document as any).price > 0" class="text-xs text-gray-400 line-through">¥{{ ((document as any).price * 1.5).toFixed(1) }}</span>
             </div>
          </div>
          <div class="text-right">
             <div class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-amber-600 rounded-full text-xs font-bold border border-yellow-100">
                <el-icon><Download /></el-icon>
                VIP 免费下
             </div>
          </div>
       </div>
    </div>

    <!-- Description -->
    <div class="mt-3 bg-white p-4">
       <h4 class="font-black text-sm text-gray-900 mb-3">详情介绍</h4>
       <p class="text-sm text-gray-500 leading-relaxed">
          这是一份高质量的企业参考文档，内容详实准确，适用于相关行业的学习、参考和业务开展。作者经过精心整理，确保了数据的真实性和逻辑的严密性。
       </p>
    </div>

    <!-- Related Docs -->
    <div class="mt-3 bg-white p-4">
      <h4 class="font-black text-sm text-gray-900 mb-3">相关文档</h4>
      <div class="space-y-4">
        <div 
          v-for="idx in 3" 
          :key="idx" 
          class="flex gap-3 py-1"
        >
          <div class="w-14 h-18 bg-gray-50 rounded shrink-0 flex items-center justify-center">
             <el-icon :size="24" class="text-gray-200"><Document /></el-icon>
          </div>
          <div class="flex-1 flex flex-col justify-center">
            <div class="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">
              相关推荐文档标题案例 {{ idx }} - 更多内容
            </div>
            <div class="mt-2 text-[10px] text-gray-400">1.2w 下载 · 48页</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Buttons -->
    <div class="fixed bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-100 flex items-center gap-4 px-6 z-50">
      <div class="flex flex-col items-center gap-1 shrink-0 text-gray-500" @click="handleShare">
         <el-icon :size="20"><Share /></el-icon>
         <span class="text-[10px]">转发</span>
      </div>
      <div class="flex flex-col items-center gap-1 shrink-0 text-gray-500" @click="toggleFavorite">
         <el-icon :size="20"><Star /></el-icon>
         <span class="text-[10px]">收藏</span>
      </div>
      <button 
        @click="handlePurchase"
        class="flex-1 h-11 btn-gradient-animate active:opacity-90 text-white rounded-full font-black text-sm shadow-lg shadow-blue-200 transition-all border-none"
      >
        {{ hasPurchased || (document as any)?.price === 0 ? '立即下载' : `立即购买 ¥${(document as any)?.price}` }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Share, Document, Download, Star } from '@element-plus/icons-vue'
import { mockDocuments } from '@/mock'
import { useMainStore } from '@/store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()
const documentId = String(route.params.id)

const document = computed(() => mockDocuments.find(d => String(d.id) === documentId))

const hasPurchased = computed(() => mainStore.ownedDocuments.includes(documentId))

const handlePurchase = () => {
  if (!mainStore.user) {
    ElMessage.warning('请先登录账户')
    router.push('/login')
    return
  }
  
  if (hasPurchased.value || (document.value as any)?.price === 0) {
    ElMessage.success('开始下载...')
    return
  }

  // Simulated purchase
  mainStore.purchaseDocument(documentId)
  ElMessage.success('支付成功，文档已解锁')
}

const toggleFavorite = () => {
  if (!mainStore.user) {
    ElMessage.warning('请登录后再收藏')
    return
  }
  ElMessage.success('已添加到收藏')
}

const handleShare = () => {
  ElMessage.success('链接已复制，去分享吧')
}
</script>
