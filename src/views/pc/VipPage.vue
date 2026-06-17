<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto py-12 px-4">
      <!-- Welcome Section -->
      <div class="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 mb-12 shadow-2xl">
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="text-white">
            <h1 class="text-4xl font-black mb-4 flex items-center gap-3">
              <el-icon class="text-yellow-400"><Trophy /></el-icon>
              稳当文档 VIP 会员
            </h1>
            <p class="text-gray-400 text-lg mb-6 max-w-xl">开通 VIP，解锁 10,000+ 精品资料，享受无限看、免费下的极致体验。</p>
            
            <!-- User Status -->
            <div v-if="userStore.user?.isVip" class="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
               <el-avatar :size="48" :src="userStore.user?.avatar" />
               <div>
                  <p class="font-bold">您的 VIP 会员正处于有效期</p>
                  <p class="text-xs text-yellow-400">有效期至：2026-12-31 (剩余 227 天)</p>
               </div>
            </div>
            <div v-else class="flex items-center gap-2 text-sm text-gray-500">
               <el-icon><InfoFilled /></el-icon>
               <span>开通后即刻享受 10 项专属特权</span>
            </div>
          </div>
          <div class="hidden md:block">
            <el-icon :size="200" class="text-white/5"><Trophy /></el-icon>
          </div>
        </div>
        <!-- Decorative patterns -->
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Pricing Plans -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        <div 
          v-for="plan in plans" 
          :key="plan.name"
          class="relative group bg-white rounded-3xl border-2 p-8 transition-all hover:-translate-y-2 cursor-pointer"
          :class="plan.isRecommended ? 'border-yellow-400 shadow-xl shadow-yellow-100 bg-yellow-50/10' : 'border-gray-50 hover:border-gray-200 shadow-sm shadow-gray-100'"
          @click="handlePay(plan)"
        >
          <!-- Badge -->
          <div v-if="plan.badge" class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg whitespace-nowrap">
            {{ plan.badge }}
          </div>

          <div class="text-center">
            <h4 class="text-lg font-bold text-gray-900 mb-6">{{ plan.name }}</h4>
            <div class="mb-6">
              <span class="text-sm font-bold text-gray-400">¥</span>
              <span class="text-5xl font-black text-gray-900 mx-1">{{ plan.price }}</span>
              <span class="text-xs text-gray-400 line-through">¥{{ plan.originalPrice }}</span>
            </div>
            <div class="bg-gray-50 rounded-xl p-3 mb-8 text-[11px] text-gray-500 leading-relaxed min-h-[50px] flex items-center justify-center">
               每天低至 {{ (plan.price / plan.days).toFixed(1) }} 元，享全站文档极速下载
            </div>
            <el-button 
              :type="plan.isRecommended ? 'warning' : 'primary'" 
              class="w-full h-12 rounded-xl text-md font-bold shadow-lg"
              :class="plan.isRecommended ? 'shadow-yellow-200' : 'shadow-blue-100'"
            >
              立即开通
            </el-button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-20">
        <div class="bg-white pt-12 pb-6 text-center">
           <h2 class="text-3xl font-black text-gray-900 tracking-tight">会员权益对比</h2>
        </div>

        <div class="p-4 lg:p-8 overflow-x-auto">
          <!-- Custom Grid Table -->
          <div class="min-w-[900px] relative">
            <!-- Header -->
            <div class="grid grid-cols-[1.5fr_repeat(5,1fr)] gap-2 pb-6 border-b border-gray-100 mb-2 px-4 items-end">
              <div class="text-left font-bold text-gray-400 text-[11px] uppercase tracking-wider pl-12">权益项目 / 会员等级</div>
              <div class="text-center font-bold text-gray-900 text-sm pb-2">非会员</div>
              <div class="text-center font-bold text-gray-900 text-sm pb-2">周会员</div>
              <div class="text-center font-bold text-gray-900 text-sm pb-2">月会员</div>
              <div class="text-center font-bold text-gray-900 text-sm pb-2">季会员</div>
              <div class="text-center font-bold text-emerald-600 text-sm pb-2 relative">
                年会员
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-[9px] text-white rounded-full whitespace-nowrap shadow-sm">超值推荐</div>
              </div>
            </div>

            <!-- Body -->
            <div class="space-y-1 relative">
              <!-- Highlighting Column for Yearly -->
              <div class="absolute top-0 right-0 w-[calc(100%/6.5)] h-full bg-emerald-50/40 rounded-2xl -z-10 border border-emerald-100/50"></div>

              <div 
                v-for="row in benefits" 
                :key="row.name"
                class="grid grid-cols-[1.5fr_repeat(5,1fr)] gap-2 items-center group py-5 px-4 rounded-xl hover:bg-gray-50/50 transition-all border-b border-gray-50 last:border-0"
              >
                <!-- Project Info -->
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-105 transition-transform">
                     <el-icon :size="20" :class="row.iconColor"><component :is="row.icon" /></el-icon>
                  </div>
                  <div class="flex flex-col justify-center">
                    <div class="font-bold text-gray-800 text-sm">{{ row.name }}</div>
                    <div class="text-[10px] text-gray-400 leading-tight">{{ row.desc }}</div>
                  </div>
                </div>

                <!-- Values -->
                <div v-for="key in ['free', 'weekly', 'monthly', 'quarterly', 'yearly']" :key="key" class="flex justify-center">
                  <div 
                    class="inline-flex items-center justify-center min-w-[64px] px-2 py-1 rounded-full font-bold text-[12px]"
                    :class="[
                      row[key] === 'X' ? 'text-gray-300' : 
                      key === 'yearly' ? 'text-emerald-700 bg-emerald-100/30' : 'text-gray-600'
                    ]"
                  >
                    <el-icon v-if="row[key] === '✓'" :size="14" class="text-emerald-500"><Check /></el-icon>
                    <span v-else>{{ row[key] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <section class="max-w-3xl mx-auto space-y-8">
        <h3 class="text-2xl font-bold text-center text-gray-900">常见问题</h3>
        <el-collapse accordion class="faq-collapse">
          <el-collapse-item title="开通后没有立即生效怎么办？" name="1">
            <p class="text-sm text-gray-500 leading-relaxed">由于网络延迟，可能会出现生效滞后的情况。请尝试刷新页面或重新登录。如超过 5 分钟未生效，请联系在线客服处理。</p>
          </el-collapse-item>
          <el-collapse-item title="VIP 用户下载所有文档都免费吗？" name="2">
            <p class="text-sm text-gray-500 leading-relaxed">VIP 用户可以免费预览全站文档。对于标记为“VIP 免费”的文档可直接下载，对于极少数作者设置的“纯付费”文档，VIP 用户通常享有 5-8 折优惠。</p>
          </el-collapse-item>
          <el-collapse-item title="会员到期后，下载的文档还能看吗？" name="3">
            <p class="text-sm text-gray-500 leading-relaxed">下载到本地的文档不限时查看。如果您在会员期间购买了下载权限，该记录将永久保留在您的账户中。</p>
          </el-collapse-item>
        </el-collapse>
      </section>
    </div>

    <!-- Payment Dialog -->
    <el-dialog v-model="payVisible" title="收银台" width="480" align-center>
       <div v-if="selectedPlan" class="py-4">
          <div class="bg-gray-50 p-6 rounded-2xl mb-8 flex justify-between items-center">
             <div>
               <p class="text-xs text-gray-400 mb-1">开通方案</p>
               <h4 class="font-bold text-lg text-gray-900">{{ selectedPlan.name }}</h4>
             </div>
             <div class="text-right">
               <span class="text-xs text-gray-400">应付金额</span>
               <div class="text-2xl font-black text-orange-600">¥ {{ selectedPlan.price }}</div>
             </div>
          </div>
          
          <h5 class="font-bold text-sm mb-4">支付方式</h5>
          <div class="space-y-3">
             <div 
              class="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-green-500 group"
              :class="payType === 'wechat' ? 'border-green-500 bg-green-50/20' : 'border-gray-100'"
              @click="payType = 'wechat'"
             >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white">
                    <el-icon :size="18"><ChatDotRound /></el-icon>
                  </div>
                  <span class="font-bold text-sm">微信支付</span>
                </div>
                <el-radio v-model="payType" label="wechat" size="small"><span class="hidden"></span></el-radio>
             </div>
             <div 
              class="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:border-blue-500 group"
              :class="payType === 'alipay' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-100'"
              @click="payType = 'alipay'"
             >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">
                    <el-icon :size="18"><Connection /></el-icon>
                  </div>
                  <span class="font-bold text-sm">支付宝支付</span>
                </div>
                <el-radio v-model="payType" label="alipay" size="small"><span class="hidden"></span></el-radio>
             </div>
          </div>

          <div class="mt-10 px-4">
             <el-button type="primary" size="large" class="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-100" @click="confirmPay">确认支付 ¥ {{ selectedPlan.price }}</el-button>
             <p class="text-[10px] text-center text-gray-400 mt-6 italic">点击支付即代表您同意《会员服务协议》</p>
          </div>
       </div>
    </el-dialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { Trophy, InfoFilled, Check, ChatDotRound, Connection, Tickets, StarFilled, Opportunity, DocumentCopy, PriceTag, Service, Download } from '@element-plus/icons-vue'
import { useMainStore } from '@/store'
import { ElMessage } from 'element-plus'

const userStore = useMainStore()
const router = useRouter()

const plans = [
  { name: 'VIP 周卡', price: 9.9, originalPrice: 19.9, days: 7, badge: '' },
  { name: 'VIP 月卡', price: 29, originalPrice: 59, days: 31, badge: '热卖中' },
  { name: 'VIP 季卡', price: 78, originalPrice: 168, days: 93, badge: '性价比之选', isRecommended: true },
  { name: 'VIP 年卡', price: 138, originalPrice: 388, days: 365, badge: '限时促销' }
]

interface BenefitRow {
  name: string
  desc: string
  icon: any
  iconColor: string
  free: string
  weekly: string
  monthly: string
  quarterly: string
  yearly: string
  [key: string]: any
}

const benefits: BenefitRow[] = [
  { 
    name: '免费下载券', 
    desc: '平台通用，灵活抵扣下载额度',
    icon: Download,
    iconColor: 'text-blue-500',
    free: '10张', 
    weekly: '5张', 
    monthly: '30张', 
    quarterly: '100张', 
    yearly: '500张' 
  },
  { 
    name: 'VIP特权下载', 
    desc: '会员专享，下载无忧实时顺延',
    icon: StarFilled,
    iconColor: 'text-yellow-500',
    free: '0次', 
    weekly: '5次', 
    monthly: '25次', 
    quarterly: '80次', 
    yearly: '350次' 
  },
  { 
    name: '点亮VIP身份', 
    desc: '尊贵标识，全站可见显身份',
    icon: Opportunity,
    iconColor: 'text-blue-400',
    free: 'X', 
    weekly: '✓', 
    monthly: '✓', 
    quarterly: '✓', 
    yearly: '✓' 
  },
  { 
    name: '一键复制', 
    desc: '文档文字随心复制，高效学习',
    icon: DocumentCopy,
    iconColor: 'text-amber-600',
    free: 'X', 
    weekly: '✓', 
    monthly: '✓', 
    quarterly: '✓', 
    yearly: '✓' 
  },
  { 
    name: '购买折扣', 
    desc: '折上折优惠，省钱升学首选',
    icon: PriceTag,
    iconColor: 'text-orange-400',
    free: '无折扣', 
    weekly: '9折', 
    monthly: '8.5折', 
    quarterly: '8折', 
    yearly: '7折' 
  },
  { 
    name: '一对一客服', 
    desc: '极速响应，专属服务贴心护航',
    icon: Service,
    iconColor: 'text-emerald-500',
    free: 'X', 
    weekly: '✓', 
    monthly: '✓', 
    quarterly: '✓', 
    yearly: '✓' 
  }
]

const payVisible = ref(false)
const selectedPlan = ref<any>(null)
const payType = ref('wechat')

const handlePay = (plan: any) => {
  if (!userStore.user) {
    ElMessage.warning('请先登录再进行支付')
    router.push('/login')
    return
  }
  selectedPlan.value = plan
  payVisible.value = true
}

const confirmPay = () => {
  ElMessage.success({
    message: '支付模拟成功，您已正式开通 VIP',
    duration: 3000
  })
  userStore.setUser({
    ...userStore.user!,
    isVip: true
  })
  payVisible.value = false
}
</script>

<style scoped>
.benefits-table :deep(.el-table__row) {
  height: 90px;
}
.benefits-table :deep(.el-table__inner-wrapper::before) {
  display: none;
}
.benefits-table :deep(.el-table__border-left-patch) {
  display: none;
}
.benefits-table :deep(td.el-table__cell) {
  border-bottom: 1px solid #f9fafb;
}
.faq-collapse :deep(.el-collapse-item__header) {
  font-weight: bold;
  height: 60px;
  border-bottom-color: #f3f4f6;
}
.faq-collapse :deep(.el-collapse-item__content) {
  padding-bottom: 20px;
}
</style>
