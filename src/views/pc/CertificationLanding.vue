<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { 
  Check, Position, Search, VideoPlay, Star, ArrowRight,
  School, Collection, User, MagicStick, ChatDotRound, Medal
} from '@element-plus/icons-vue'

const router = useRouter()

const professions = [
  '大学教授', '人民教师', '视觉设计师', '软件工程师', '投资顾问', 
  '销售顾问', 'PHP工程师', '律师顾问', 'web研发', '科研人员'
]

const benefits = [
  {
    title: '搜索领先',
    desc: '上传文档专享搜索引擎加权展示，更多曝光机会。',
    icon: Search,
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    title: '优先展示',
    desc: '优质用户网站首页巡展，打造个人专业IP品牌。',
    icon: Position,
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: '抢先体验',
    desc: '文档新功能特邀抢驻体验，优先试用AI辅助工具。',
    icon: MagicStick,
    color: 'bg-indigo-100 text-indigo-700'
  },
  {
    title: '权威身份',
    desc: '加V身份标识，建立专业信任，享受更高提成。',
    icon: Medal,
    color: 'bg-amber-100 text-amber-700'
  }
]

const steps = [
  {
    title: '加入认证',
    desc: '上传身份或职业证明资料，申请认证身份',
    icon: User
  },
  {
    title: '等待审核',
    desc: '系统将在三个工作日内反馈审核结果',
    icon: ChatDotRound
  },
  {
    title: '完成认证',
    desc: '开启专属权益，助力专业价值成长',
    icon: Star
  }
]

const handleApply = () => {
  router.push('/certification/apply')
}
</script>

<template>
  <AppLayout>
    <div class="certification-landing">
      <!-- Hero Section -->
      <section class="relative bg-indigo-950 py-16 overflow-hidden rounded-[2rem] mb-16 shadow-2xl">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        
        <div class="relative max-w-4xl mx-auto px-6 text-center text-white">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-8 animate-fade-in-up">
            <el-icon class="text-amber-400"><Star /></el-icon>
            <span>专业创作者认证计划已开启</span>
          </div>
          
          <h1 class="text-6xl font-black mb-6 tracking-tight animate-fade-in-up" style="animation-delay: 0.1s">
            个人认证
          </h1>
          <p class="text-xl text-indigo-100/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.2s">
            分享您的独特见解，领导客源权威最前沿。汇聚全球学术、技术与创意人才，共同建设高质量知识生态。
          </p>
          
          <div class="flex flex-col items-center gap-6 animate-fade-in-up" style="animation-delay: 0.3s">
            <el-button 
              type="warning" 
              size="large" 
              class="!h-16 !px-12 !text-lg !font-bold !rounded-2xl shadow-xl !bg-amber-500 !border-none hover:!bg-amber-600 hover:!scale-105 transition-all"
              @click="handleApply"
            >
              立即加入创作者圈
            </el-button>
            
            <div class="flex flex-wrap justify-center gap-3 mt-12 max-w-3xl">
              <span 
                v-for="tag in professions" 
                :key="tag"
                class="px-5 py-2 bg-white/5 backdrop-blur-sm rounded-xl text-sm text-indigo-100/60 border border-white/10 hover:bg-white/20 transition-colors"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="mb-24">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-black text-gray-900 mb-4">认证专属特权</h2>
          <p class="text-gray-400">更精准的流量分配，更高效的价值转化</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="benefit in benefits" 
            :key="benefit.title"
            class="group p-8 bg-white border border-gray-100 rounded-3xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
          >
            <div :class="[benefit.color, 'w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500']">
              <el-icon :size="32"><component :is="benefit.icon" /></el-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">{{ benefit.title }}</h3>
            <p class="text-gray-400 leading-relaxed">{{ benefit.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Process Section -->
      <section class="mb-24 py-24 bg-gray-50 rounded-[3rem] px-12 overflow-hidden relative">
        <div class="absolute top-0 right-0 p-12 text-gray-100 -rotate-12 translate-x-12 -translate-y-6">
          <el-icon :size="300"><Medal /></el-icon>
        </div>
        
        <div class="relative">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-black text-gray-900 mb-4">简单三步 完成认证</h2>
            <p class="text-gray-400">最快 1 小时内通过审核，开启专业之旅</p>
          </div>
          
          <div class="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
            <div 
              v-for="(step, index) in steps" 
              :key="step.title"
              class="flex flex-col items-center text-center relative max-w-[240px]"
            >
              <div class="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-black mb-8 shadow-xl shadow-indigo-200 relative z-10">
                {{ index + 1 }}
              </div>
              
              <!-- Divider Line -->
              <div 
                v-if="index < steps.length - 1" 
                class="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-indigo-100 -z-0"
              ></div>
              
              <h4 class="text-xl font-bold text-gray-900 mb-4">{{ step.title }}</h4>
              <p class="text-gray-400 text-sm leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom CTA -->
      <section class="text-center bg-indigo-950 py-12 rounded-[3rem] text-white">
        <h2 class="text-4xl font-black mb-8">准备好开启您的专业认证了吗？</h2>
        <div class="flex justify-center gap-4">
          <el-button 
            type="primary" 
            size="large" 
            class="!h-16 !px-12 !text-lg !font-bold !rounded-2xl !bg-indigo-600 !border-none hover:bg-indigo-700"
            @click="handleApply"
          >
            立即申请认证
          </el-button>
          <el-button 
            size="large" 
            class="!h-16 !px-12 !text-lg !font-bold !rounded-2xl !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
          >
            常见问题咨询
          </el-button>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<style scoped>
.animation-delay-200 {
  animation-delay: 0.2s;
}
.animation-delay-300 {
  animation-delay: 0.3s;
}
</style>
