<template>
  <AppLayout>
    <div v-if="doc" class="flex gap-8 py-6 items-start">
      <!-- 左侧：文档内容 -->
      <main class="flex-1 min-w-0">
        <!-- 头部信息 -->
        <div class="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-6">
          <div class="flex items-start justify-between gap-6 mb-6">
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <el-tag type="danger" size="small" v-if="doc.format === 'pdf'">PDF</el-tag>
                <el-tag type="primary" size="small" v-else>{{ doc.format.toUpperCase() }}</el-tag>
                {{ doc.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
                <span class="flex items-center gap-1"><el-icon><Timer /></el-icon> {{ doc.uploadTime }}</span>
                <span>大小：{{ (Math.random() * 5 + 0.5).toFixed(1) }} MB</span>
                <span>页数：{{ doc.pages }} 页</span>
                <span class="flex items-center gap-1"><el-icon><View /></el-icon> {{ doc.downloadCount * 12 + 45 }} 次阅读</span>
                <div class="flex gap-2 ml-auto">
                   <el-tag v-for="tag in ['课程笔记', '精品', doc.category]" :key="tag" size="small" effect="plain" class="rounded-full">{{ tag }}</el-tag>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div class="flex items-center gap-4">
              <div class="text-xs text-gray-400">下载权益</div>
              <div v-if="doc.price === 0" class="flex items-center gap-1 text-green-600 font-bold">
                 <el-icon><Check /></el-icon> 免费文档
              </div>
              <div v-else class="flex items-center gap-3">
                <span class="text-orange-600 font-black text-xl">¥{{ doc.price }}</span>
                <el-tag type="warning" size="small" effect="dark" class="bg-gradient-to-r from-yellow-400 to-orange-500 border-none">VIP 免费</el-tag>
              </div>
            </div>
            <div class="flex gap-3">
               <el-button :icon="isFavorited ? StarFilled : Star" :type="isFavorited ? 'warning' : 'default'" circle @click="toggleFavorite" />
               <el-button :icon="Share" circle @click="handleShare" />
               <el-button :icon="Warning" circle @click="reportVisible = true" />
               <el-button type="primary" size="large" class="px-8 shadow-lg shadow-blue-200 btn-gradient-animate border-none font-bold" @click="handleDownload">
                 {{ hasPurchased || doc.price === 0 ? '立即下载' : '购买下载' }}
               </el-button>
            </div>
          </div>
        </div>

        <!-- 所属文集提示 -->
        <div v-if="parentCollection" class="bg-gradient-to-r from-blue-600 to-blue-400 p-4 rounded-xl mb-6 flex items-center justify-between text-white shadow-md">
           <div class="flex items-center gap-4">
              <div class="w-12 h-16 bg-white/20 rounded overflow-hidden backdrop-blur-sm">
                <img :src="parentCollection.cover" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="text-xs text-white/80 mb-1">本文选自文集</p>
                <h4 class="font-bold text-sm">{{ parentCollection.title }}</h4>
              </div>
           </div>
           <el-button link class="!text-white border border-white/40 hover:bg-white/10 px-4 py-1.5 rounded-full text-xs">
              查看全部 {{ parentCollection.docCount }} 篇
           </el-button>
        </div>

        <!-- AI 辅助工具区 -->
        <div class="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border border-blue-100 rounded-xl p-6 mb-8 shadow-sm group">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <el-icon><MagicStick /></el-icon>
              </div>
              <div>
                <h3 class="font-bold text-gray-800 text-sm">AI 辅助办公</h3>
                <p class="text-[10px] text-gray-400">基于大语言模型为您提供高效文档查阅能力</p>
              </div>
              <span class="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded ml-2 font-bold uppercase tracking-wider">Beta</span>
            </div>
            <div class="text-[11px] text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-50">
              今日剩余：<span :class="['font-bold', isVip ? 'text-blue-600' : (aiRemainCount > 0 ? 'text-green-600' : 'text-red-500')]">
                {{ isVip ? '无限' : aiRemainCount }}
              </span> 次 
              <span v-if="!isVip" class="text-gray-300 ml-1">(开通VIP享无限次数)</span>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div 
              class="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group/btn shadow-sm"
              @click="handleAiSummary"
            >
              <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover/btn:bg-indigo-500 group-hover/btn:text-white transition-colors">
                <el-icon :size="20"><ChatLineSquare /></el-icon>
              </div>
              <div class="text-center">
                <p class="text-xs font-bold text-gray-700">AI 总结</p>
                <p class="text-[9px] text-gray-400 mt-0.5">秒级生成核心摘要</p>
              </div>
            </div>

            <div 
              class="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group/btn shadow-sm"
              @click="handleAiQA"
            >
              <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors">
                <el-icon :size="20"><ChatDotSquare /></el-icon>
              </div>
              <div class="text-center">
                <p class="text-xs font-bold text-gray-700">AI 问答</p>
                <p class="text-[9px] text-gray-400 mt-0.5">针对文档内容答疑</p>
              </div>
            </div>

            <div 
              class="bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group/btn shadow-sm"
              @click="handleAiPPT"
            >
              <div class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover/btn:bg-orange-500 group-hover/btn:text-white transition-colors">
                <el-icon :size="20"><CollectionIcon /></el-icon>
              </div>
              <div class="text-center">
                <p class="text-xs font-bold text-gray-700">生成 PPT</p>
                <p class="text-[9px] text-gray-400 mt-0.5">根据文档提取大纲</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 文档预览 -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div class="p-4 bg-gray-50 border-b flex justify-between items-center text-xs text-gray-500">
            <span class="font-medium text-gray-700">在线预览 (可预览前 3 页 / 共 {{ doc.pages }} 页)</span>
            <div class="flex gap-6 items-center">
              <div class="flex items-center gap-2 border-r pr-4">
                 <el-button size="small" circle :icon="Minus" />
                 <span class="w-12 text-center select-none font-bold">100%</span>
                 <el-button size="small" circle :icon="Plus" />
              </div>
              <el-icon class="cursor-pointer hover:text-blue-600" size="16"><FullScreen /></el-icon>
            </div>
          </div>
          
          <div class="relative p-12 bg-gray-600 flex flex-col items-center gap-8 min-h-[1200px]">
            <!-- 模拟多页预览 (Canvas 样式) -->
            <div v-for="i in 3" :key="i" class="w-full max-w-[800px] aspect-[1/1.41] bg-white shadow-2xl relative overflow-hidden flex items-center justify-center group">
              <!-- Mock Canvas Drawing -->
              <div class="absolute inset-0 opacity-[0.03] select-none pointer-events-none p-12 leading-loose text-center text-8xl flex flex-wrap justify-center items-center overflow-hidden rotate-[-30deg]">
                WENDANG WENDANG WENDANG WENDANG
              </div>
              <img :src="`https://picsum.photos/seed/view_${doc.id}_${i}/800/1131`" class="w-full h-full object-cover opacity-90" />
              <div class="absolute top-4 right-4 bg-black/10 px-2 py-1 rounded text-[10px] text-gray-500 backdrop-blur-sm">{{ i }} / {{ doc.pages }}</div>
            </div>
            
            <!-- Read More Overlay -->
            <div class="absolute bottom-0 inset-x-0 h-[600px] bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent flex flex-col items-center justify-end pb-20">
               <div class="text-center px-4 max-w-md">
                 <div class="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
                    <el-icon><Warning /></el-icon> 预览已结束，开通 VIP 查看全部页面
                 </div>
                 <h2 class="text-white text-2xl font-bold mb-4">下载后获取完整清晰版</h2>
                 <p class="text-white/60 text-sm mb-8 leading-relaxed">该文档共 {{ doc.pages }} 页，当前仅展示前 3 页。下载文档即可在本地或移动端随时进行查看、编辑和打印。</p>
                 <el-button type="primary" size="large" class="px-12 py-6 text-lg rounded-xl shadow-xl shadow-blue-900" @click="handleDownload">
                   {{ hasPurchased || doc.price === 0 ? '免费下载原文' : `支付 ¥${doc.price} 下载` }}
                 </el-button>
                 <p class="text-white/40 text-[10px] mt-6 italic">© 本内容受版权法律保护，未经许可严禁传播</p>
               </div>
            </div>
          </div>
        </div>

        <!-- 其他推荐 (横向滚动) -->
        <div class="mb-8">
           <div class="flex items-center justify-between mb-4 px-2">
             <h3 class="text-lg font-bold text-gray-800">猜你喜欢</h3>
             <el-button link class="text-blue-600">换一换</el-button>
           </div>
           <div class="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
              <div 
                v-for="rdoc in relatedDocuments" 
                :key="rdoc.id" 
                class="w-40 shrink-0 group cursor-pointer"
                @click="router.push(`/document/${rdoc.id}`)"
              >
                 <div class="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-100 shadow-sm relative mb-2">
                    <img :src="rdoc.cover" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div class="absolute top-2 right-2 flex gap-1">
                       <el-tag size="small" type="danger" v-if="rdoc.price > 50" class="!px-1 border-none bg-red-500/80 backdrop-blur-sm text-white">精品</el-tag>
                    </div>
                 </div>
                 <h4 class="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 mb-1">{{ rdoc.title }}</h4>
                 <div class="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{{ rdoc.format.toUpperCase() }} | {{ rdoc.pages }}页</span>
                    <span class="text-orange-600 font-bold" v-if="rdoc.price > 0">¥{{ rdoc.price }}</span>
                    <span class="text-green-600 font-bold" v-else>免费</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- 评论区 -->
        <div class="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h3 class="text-lg font-bold mb-6">评论 (24)</h3>
          <div class="flex gap-4 mb-8">
            <el-avatar :size="40" src="https://ui-avatars.com/api/?name=我&background=random" />
            <div class="flex-1">
              <el-input 
                v-model="commentText" 
                type="textarea" 
                :rows="3" 
                placeholder="尊重原创，友善评论..." 
              />
              <div class="flex justify-end mt-2">
                <el-button type="primary" @click="submitComment">发布评论</el-button>
              </div>
            </div>
          </div>

          <div class="space-y-8">
            <div v-for="i in 3" :key="i" class="flex gap-4">
              <el-avatar :size="40" :src="`https://ui-avatars.com/api/?name=用户${i}&background=random`" />
              <div class="flex-1 border-b pb-6 last:border-0">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold text-sm">知识拾荒者 {{ i }}</span>
                  <span class="text-xs text-gray-400">2026-05-17 14:00</span>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed mb-3">
                  这份文档总结得非常到位，尤其是第三章节关于实战的部分，对我帮助很大，感谢作者分享！
                </p>
                <div class="flex gap-4 text-xs text-gray-400">
                  <span class="cursor-pointer hover:text-blue-600 flex items-center gap-1"><el-icon><ChatDotRound /></el-icon> 回复</span>
                  <span class="cursor-pointer hover:text-blue-600 flex items-center gap-1"><el-icon><CaretTop /></el-icon> 赞 ({{ 12 + i }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- 右侧：作者与推荐 -->
      <aside class="w-80 shrink-0 space-y-6">
        <!-- 上传者信息 -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <el-avatar :size="80" :src="uploader.avatar" class="mb-4" />
          <h4 class="font-bold text-lg mb-1">{{ uploader.nickname }}</h4>
          <p class="text-xs text-gray-400 mb-6 font-medium">Lv.{{ uploader.level }} | 信誉分 {{ uploader.score }}</p>
          <div class="flex gap-3">
            <el-button type="primary" class="flex-1">关注</el-button>
            <el-button class="flex-1">私信</el-button>
          </div>
          <el-divider />
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="font-bold text-gray-900 border-b border-white">24</p>
              <p class="text-[10px] text-gray-400 mt-1">文档</p>
            </div>
            <div>
              <p class="font-bold text-gray-900">1.2k</p>
              <p class="text-[10px] text-gray-400 mt-1">关注者</p>
            </div>
            <div>
              <p class="font-bold text-gray-900">8.5k</p>
              <p class="text-[10px] text-gray-400 mt-1">下载</p>
            </div>
          </div>
        </div>

        <!-- 相关推荐 -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 class="font-bold mb-4 flex items-center gap-2">
            <el-icon class="text-blue-600"><Connection /></el-icon>
            相关推荐
          </h3>
          <div class="space-y-4">
            <div v-for="rdoc in mockDocuments.slice(0, 5)" :key="rdoc.id" class="flex gap-3 group cursor-pointer">
              <div class="w-12 h-16 bg-gray-100 rounded shrink-0 overflow-hidden">
                <img :src="rdoc.cover" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{{ rdoc.title }}</h5>
                <p class="text-[10px] text-gray-400 mt-1">{{ rdoc.downloadCount }} 下载</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 热门榜单 -->
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 class="font-bold mb-4 flex items-center gap-2">
            <el-icon class="text-orange-500"><Trophy /></el-icon>
            {{ doc?.category }}热门榜
          </h3>
          <div class="space-y-3">
             <div v-for="(rdoc, idx) in relatedRankDocs" :key="rdoc.id" class="flex items-center gap-3">
               <span :class="['w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold', idx < 3 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400']">
                 {{ idx + 1 }}
               </span>
               <span class="text-xs text-gray-700 truncate flex-1 hover:text-blue-600 cursor-pointer">{{ rdoc.title }}</span>
             </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Invalid Doc State -->
    <div v-else class="py-20 text-center">
      <el-empty description="该文档不存在或已被下架">
        <el-button type="primary" @click="router.push('/')">回到首页</el-button>
      </el-empty>
    </div>

    <!-- 支付弹窗 -->
    <PaymentModal
      v-if="doc"
      v-model:visible="paymentVisible"
      :title="doc?.title || ''"
      :price="doc?.price || 0"
      @success="handlePaySuccess"
    />

    <!-- 举报弹窗 -->
    <ReportModal
      v-if="doc"
      v-model="reportVisible"
      :target-title="doc.title"
      :target-id="doc.id"
    />

    <!-- 底部悬浮下载栏 -->
    <transition name="fade">
      <div v-if="showFloatBar && doc" class="fixed bottom-0 inset-x-0 h-16 bg-white/90 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 border-t">
        <div class="max-w-[1440px] mx-auto px-4 h-full flex items-center justify-between">
          <div class="flex items-center gap-4">
            <h4 class="font-bold text-gray-900 max-w-md truncate">{{ doc.title }}</h4>
            <span class="text-xs text-gray-400">12.5 MB | {{ doc.format.toUpperCase() }}</span>
          </div>
          <div class="flex items-center gap-6">
            <div class="text-right">
              <p class="text-xs text-gray-400 mb-0.5">下载所需</p>
              <p class="font-bold text-orange-600">{{ (hasPurchased || doc.price === 0) ? '免费' : '¥' + doc.price }}</p>
            </div>
            <el-button type="primary" size="large" @click="handleDownload">
              {{ hasPurchased || doc.price === 0 ? '立即下载' : '购买下载' }}
            </el-button>
          </div>
        </div>
      </div>
    </transition>
    <!-- AI Summary Dialog -->
    <el-dialog
      v-model="aiSummaryVisible"
      title="AI 智能文档分析"
      width="680"
      align-center
      destroy-on-close
      class="ai-summary-dialog rounded-2xl overflow-hidden"
    >
      <div v-loading="generatingSummary" element-loading-text="AI 正在深度解析文档..." element-loading-background="rgba(255, 255, 255, 0.8)" class="min-h-[400px]">
        <div v-if="aiSummaryContent" v-html="aiSummaryContent"></div>
      </div>
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-400">
            * 结果由 AI 生成，可能存在误差
          </div>
          <div class="flex gap-3">
            <el-button @click="aiSummaryVisible = false">关闭</el-button>
             <el-button type="primary" @click="handleDownload">下载原文档</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useMainStore } from '@/store'
import { 
  Star, StarFilled, Download, View, ChatDotRound, CaretTop, 
  Connection, Trophy, Share, Warning, CopyDocument, Timer,
  Check, ArrowRight, Minus, Plus, FullScreen, MagicStick, ChatLineSquare,
  ChatDotSquare, Collection as CollectionIcon
} from '@element-plus/icons-vue'
import PaymentModal from '@/components/PaymentModal.vue'
import ReportModal from '@/components/ReportModal.vue'
import { mockDocuments, mockUsers, mockCollections } from '@/mock'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()
const docId = computed(() => route.params.id as string)

const isVip = computed(() => mainStore.user?.isVip || false)
const aiRemainCount = ref(2)
const aiSummaryVisible = ref(false)
const aiSummaryContent = ref('')
const generatingSummary = ref(false)

const hasPurchased = computed(() => {
  if (!docId.value) return false
  return mainStore.ownedDocuments.includes(docId.value)
})

const checkAuth = (action: string) => {
  if (!mainStore.user) {
    ElMessage.warning(`请先登录后再进行${action}`)
    router.push('/login')
    return false
  }
  return true
}

const handleAiSummary = async () => {
  if (!checkAuth('使用 AI 功能')) return
  
  if (!isVip.value && aiRemainCount.value <= 0) {
    ElMessageBox.confirm(
      '今日AI使用次数已用完，开通VIP会员即可享受无限次AI辅助功能。',
      '使用次数不足',
      {
        confirmButtonText: '开通VIP',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      router.push('/vip')
    }).catch(() => {})
    return
  }

  aiSummaryVisible.value = true
  generatingSummary.value = true
  
  // Simulated AI generation
  setTimeout(() => {
    if (!doc.value) return
    
    const title = doc.value?.title || ''
    const category = doc.value?.category || ''
    
    aiSummaryContent.value = `
      <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed font-sans">
        <h3 class="text-lg font-bold text-blue-600 mb-4 border-b pb-2">《${title}》核心摘要</h3>
        
        <p class="font-bold text-gray-900 mb-2">一、 文档背景与核心价值</p>
        <p class="mb-4">本文档作为${category}领域的精品资料，主要针对当前学习与研究中的难点进行了系统性梳理。其核心价值在于提供了一套完整的学习框架，涵盖了从理论基础到实战应用的全过程。尤其对于${title}中提到的关键知识点有着独到的见解和深度的剖析。</p>
        
        <p class="font-bold text-gray-900 mb-2">二、 核心知识点梳理</p>
        <ul class="list-disc pl-5 mb-4 space-y-1">
          <li><strong>体系架构：</strong> 深入浅出地讲解了${category}的基本原则，建立了清晰的认知模型。</li>
          <li><strong>方法论：</strong> 文档中提出的“三步走”策略是该领域的创新，具有极强的实操指导意义。</li>
          <li><strong>案例分析：</strong> 结合了大量的真实案例，通过对比分析，使复杂的理论变得易于理解。</li>
          <li><strong>前沿洞察：</strong> 对未来的发展趋势做了前瞻性预测，具备一定的参考价值。</li>
        </ul>
        
        <p class="font-bold text-gray-900 mb-2">三、 学习建议与实战应用</p>
        <p class="mb-4">建议读者在阅读时，先从大纲入手掌握整体结构，再重点研读案例部分。本文档提供的各种图表和模型可以直接应用于实际工作中，能够显著提升工作效率。特别是对于希望在${category}方向有所突破的人员，是一份不可多得的参考手册。</p>
        
        <p class="font-bold text-gray-900 mb-2">四、 总结评价</p>
        <p>总体而言，《${title}》结构严谨、逻辑清晰、内容详实。既适合初学者作为入门教材，也适合资深从业者作为工具书备查。文档中包含的${doc.value?.pages || 0}页内容经过了作者精心的打磨，具有极高的含金量。AI分析认为，该文档的实用性评分为 9.5/10。</p>
        
        <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-[10px] text-gray-400 italic">
          * 以上摘要由 AI 深度分析生成，仅供快速了解文档内容参考。如需获取精确信息，请点击下载完整文档。
        </div>
      </div>
    `
    generatingSummary.value = false
    if (!isVip.value) aiRemainCount.value--
  }, 1500)
}

const handleAiQA = () => {
    ElMessage.info('AI 问答功能正在火速更新中...')
}

const handleAiPPT = () => {
    ElMessage.info('AI 生成 PPT 功能已开启内测，敬请期待')
}

const doc = computed(() => mockDocuments.find(d => d.id === docId.value))

// Find collection this doc belongs to
const parentCollection = computed(() => {
  return mockCollections.find(c => c.docs?.some(d => d.id === docId.value))
})

const relatedDocuments = computed(() => {
  if (!doc.value) return []
  return mockDocuments.filter(d => d.category === doc.value?.category && d.id !== doc.value?.id).slice(0, 8)
})

const relatedRankDocs = computed(() => {
  if (!doc.value) return []
  return mockDocuments.filter(d => d.category === doc.value?.category).sort((a,b) => b.downloadCount - a.downloadCount).slice(0, 5)
})

// Mock uploader matches user in mock
const uploader = computed(() => {
  const uId = typeof doc.value?.uploader === 'string' ? doc.value.uploader : 'u1'
  return mockUsers.find(u => u.id === uId) || mockUsers[0]
})

const isFavorited = ref(false)
const toggleFavorite = () => {
  if (!checkAuth('收藏')) return
  isFavorited.value = !isFavorited.value
  ElMessage.success(isFavorited.value ? '已添加到收藏' : '已取消收藏')
}

const handleShare = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
  ElMessage.success('链接已复制到剪贴板')
}

const reportVisible = ref(false)

const paymentVisible = ref(false)

const handleDownload = () => {
  if (doc.value?.price === 0 || hasPurchased.value || isVip.value) {
    ElMessage.success('开始下载文件...')
    return
  }
  if (!checkAuth('购买')) return
  paymentVisible.value = true
}

const handlePaySuccess = () => {
  mainStore.purchaseDocument(docId.value)
  ElMessage.success('支付成功，您可以下载该文档了')
}

const commentText = ref('')
const submitComment = () => {
  if (!commentText.value) return
  ElMessage.success('评论已提交审核')
  commentText.value = ''
}

const showFloatBar = ref(false)
const handleScroll = () => {
  showFloatBar.value = window.scrollY > 400
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
