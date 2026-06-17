<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { 
  Briefcase, Management, OfficeBuilding, Service,
  Box, DataAnalysis, Connection, Checked,
  ArrowRight, Star, Medal, ChatDotRound
} from '@element-plus/icons-vue'

const router = useRouter()

const coreValues = [
  {
    title: '品牌展示',
    desc: '在文档页显著位置展示企业Logo，建立版权意识，强化专业品牌形象。',
    icon: OfficeBuilding,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: '流量分发',
    desc: '企业认证账号上传的高质量文档，将获得全站搜索引擎最高优先级的推荐。',
    icon: DataAnalysis,
    color: 'bg-cyan-50 text-cyan-600'
  },
  {
    title: '专属主页',
    desc: '为您的团队定制企业知识主页，便捷管理文档流，沉淀企业数字资产。',
    icon: Management,
    color: 'bg-slate-100 text-slate-700'
  },
  {
    title: '收益优化',
    desc: '专享企业结算后台，更低的服务费比例，支持对公转账与批量结算。',
    icon: Connection,
    color: 'bg-blue-100 text-blue-700'
  }
]

const handleApply = () => {
  router.push('/enterprise-certification/apply')
}
</script>

<template>
  <AppLayout>
    <div class="enterprise-landing pb-20">
      <!-- Mega Hero -->
      <section class="relative bg-slate-900 py-20 overflow-hidden rounded-[3rem] mb-20">
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
           <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
           <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
        </div>

        <div class="relative max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <div class="inline-flex items-center gap-3 px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-bold mb-10 animate-fade-in-up">
            <el-icon><Checked /></el-icon>
            <span>专业 · 权威 · 值得信赖</span>
          </div>
          
          <h1 class="text-7xl font-black text-white mb-8 tracking-tighter leading-tight animate-fade-in-up" style="animation-delay: 0.1s">
            企业认证
          </h1>
          <p class="text-xl text-slate-400 max-w-2xl leading-relaxed mb-14 animate-fade-in-up" style="animation-delay: 0.2s">
            展示企业专属品牌，扩大行业影响力。稳当文档诚邀具有专业版权文档的团队加入我们，为您的团队打造文档权威品牌。
          </p>
          
          <div class="flex gap-6 animate-fade-in-up" style="animation-delay: 0.3s">
            <el-button 
              type="primary" 
              size="large" 
              class="!h-16 !px-12 !text-lg !font-black !rounded-2xl !bg-blue-600 !border-none hover:!bg-blue-700 shadow-2xl shadow-blue-500/20 group"
              @click="handleApply"
            >
              申请提交认证 
              <el-icon class="ml-2 group-hover:translate-x-1 transition-transform"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </section>

      <!-- Values Grid -->
      <section class="max-w-7xl mx-auto mb-32 px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div 
             v-for="item in coreValues" 
             :key="item.title"
             class="group p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500"
           >
              <div :class="[item.color, 'w-16 h-16 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500']">
                <el-icon :size="30"><component :is="item.icon" /></el-icon>
              </div>
              <h3 class="text-2xl font-black text-gray-900 mb-4">{{ item.title }}</h3>
              <p class="text-gray-400 leading-relaxed text-sm">{{ item.desc }}</p>
           </div>
        </div>
      </section>

      <!-- Bottom Step -->
      <section class="max-w-7xl mx-auto px-6">
        <div class="bg-gradient-to-br from-slate-800 to-slate-950 p-12 md:p-16 rounded-[4rem] text-white relative overflow-hidden ring-1 ring-white/10">
           <div class="absolute top-0 right-0 p-12 opacity-10">
             <el-icon :size="400"><Medal /></el-icon>
           </div>
           
           <div class="relative max-w-3xl">
             <h2 class="text-5xl font-black mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">助力企业数字化转型，<br/>让知识资产产生价值。</h2>
             <p class="text-xl text-slate-400 mb-12">入驻稳当文档企业认证，共享行业领先的文档分发能力与版权保护技术。</p>
             <el-button 
               size="large" 
               class="!h-16 !px-12 !text-xl !font-black !rounded-2xl !bg-blue-600 !text-white !border-none hover:!scale-105 shadow-2xl shadow-blue-500/20 transition-transform"
               @click="handleApply"
             >
               立即开启企业认证
             </el-button>
           </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
