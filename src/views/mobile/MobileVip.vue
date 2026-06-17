<template>
  <div class="flex flex-col min-h-full bg-slate-900 pb-[80px]">
    <!-- Safe Area Spacer -->
    <div class="h-[44px] bg-slate-900 sticky top-0 z-[60]"></div>
    <!-- Mobile Header -->
    <div class="px-4 py-2 flex items-center justify-between sticky top-[44px] z-50 bg-slate-900">
      <el-icon :size="20" @click="router.back()" class="text-white/60 cursor-pointer"><ArrowLeft /></el-icon>
      <span class="text-sm font-black text-white">开通超级 VIP</span>
      <div class="w-5"></div>
    </div>

    <!-- VIP Banner Area -->
    <div class="px-6 py-8 text-center bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-[40px]">
       <div class="w-16 h-16 bg-yellow-500 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/20 mb-4">
          <el-icon :size="32" class="text-slate-900"><Trophy /></el-icon>
       </div>
       <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200">尊享超级特权</h1>
       <p class="text-white/40 text-xs mt-2">全站文档随便下 · 极速下载不限流</p>
    </div>

    <!-- Cards Scroll -->
    <div class="px-4 -mt-10 mb-8 overflow-x-auto">
       <div class="flex gap-3 pb-4">
          <div 
            v-for="plan in plans" 
            :key="plan.name"
            class="min-w-[150px] bg-slate-800 border-2 rounded-3xl p-5 flex flex-col items-center transition-all relative overflow-hidden"
            :class="selectedPlan === plan.name ? 'border-yellow-500 shadow-xl shadow-yellow-500/10' : 'border-slate-700'"
            @click="selectedPlan = plan.name"
          >
             <div v-if="plan.badge" class="absolute top-0 right-0 px-2 py-0.5 bg-yellow-500 text-slate-900 text-[9px] font-black rounded-bl-xl">
               {{ plan.badge }}
             </div>
             <span class="text-xs text-white/60 font-bold mb-4">{{ plan.name }}</span>
             <div class="flex items-baseline gap-0.5 text-yellow-500 mb-1">
                <span class="text-xs font-bold">¥</span>
                <span class="text-3xl font-black">{{ plan.price }}</span>
             </div>
             <span class="text-white/30 text-[10px] line-through">¥{{ plan.oldPrice }}</span>
             <div class="mt-4 text-[9px] text-white/50 bg-white/5 px-2 py-1 rounded-full">
                约 ￥{{ (plan.price / plan.days).toFixed(1) }}/天
             </div>
          </div>
       </div>
    </div>

    <!-- Benefits List -->
    <div class="px-6 space-y-6">
       <h4 class="text-white font-black text-sm">核心特权</h4>
       <div class="grid grid-cols-1 gap-6">
          <div v-for="b in benefits" :key="b.title" class="flex gap-4">
             <div class="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <el-icon :size="20" class="text-yellow-500"><component :is="b.icon" /></el-icon>
             </div>
             <div>
                <div class="text-white font-bold text-sm mb-0.5">{{ b.title }}</div>
                <div class="text-white/40 text-[11px] leading-tight">{{ b.desc }}</div>
             </div>
          </div>
       </div>
    </div>

    <!-- Pay Button -->
    <div class="fixed bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-white/5 z-50">
       <button class="w-full h-12 bg-gradient-to-r from-yellow-600 to-yellow-400 active:from-yellow-700 active:to-yellow-500 text-slate-900 rounded-full font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10">
          <span class="text-sm">微信支付支付</span>
          ¥{{ plans.find(p => p.name === selectedPlan)?.price }}
       </button>
       <p class="text-[10px] text-white/20 text-center mt-3">开通即代表同意《VIP 会员服务协议》</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy, Download, Connection, Opportunity, StarFilled } from '@element-plus/icons-vue'

const router = useRouter()
const selectedPlan = ref('VIP 年卡')

const plans = [
  { name: 'VIP 周卡', price: 9.9, oldPrice: 19, days: 7 },
  { name: 'VIP 月卡', price: 29, oldPrice: 59, days: 30, badge: '性价比' },
  { name: 'VIP 年卡', price: 138, oldPrice: 388, days: 365, badge: '最划算' }
]

const benefits = [
  { title: '无限制下载', desc: '全站 1000w+ 份文档随便下，不扣券', icon: Download },
  { title: '极速预览', desc: '全文极速无广告预览，学习办公快人一步', icon: Connection },
  { title: '尊贵身份', desc: '全站专属金冠标识，彰显尊贵身份', icon: StarFilled },
  { title: '专属提读', desc: '会员专享 AI 文档提读汇总功能', icon: Opportunity }
]
</script>
