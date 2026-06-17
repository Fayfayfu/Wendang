<template>
  <AppLayout v-if="task">
    <div class="py-10 max-w-4xl mx-auto">
      <el-breadcrumb separator="/" class="mb-8">
        <el-breadcrumb-item :to="{ path: '/tasks' }">任务广场</el-breadcrumb-item>
        <el-breadcrumb-item>任务详情</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- Task Main Card -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50 overflow-hidden mb-8">
        <div class="p-8 md:p-12">
          <!-- Header info -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <el-tag size="small" type="info" effect="plain" class="rounded-lg">{{ task.category }}</el-tag>
                <el-tag :type="getStatusType(task.status)" size="small" effect="dark" class="rounded-lg">
                  {{ getStatusText(task.status) }}
                </el-tag>
              </div>
              <h1 class="text-3xl font-black text-gray-900 leading-tight mb-2">{{ task.title }}</h1>
              <div class="flex items-center gap-6 text-sm text-gray-400">
                <span class="flex items-center gap-1.5"><el-icon><UserIcon /></el-icon> 发布人：{{ isIssuer ? '我' : '匿名用户' }}</span>
                <span class="flex items-center gap-1.5"><el-icon><CalendarIcon /></el-icon> 截止时间：{{ task.deadline }}</span>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-xs text-gray-400 uppercase tracking-widest mb-1">悬赏金额</p>
              <p class="text-4xl font-black text-rose-500">
                <span class="text-lg font-medium">¥</span>{{ task.reward.toFixed(2) }}
              </p>
            </div>
          </div>

          <el-divider />

          <!-- Description -->
          <div class="py-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              任务描述
            </h3>
            <div class="bg-gray-50/50 rounded-2xl p-6 text-gray-600 leading-relaxed whitespace-pre-wrap border border-gray-50">
              {{ task.description }}
            </div>
          </div>

          <!-- Deliverables (Issuer View) -->
          <div v-if="task.status === TaskStatus.REVIEWING && isIssuer" class="mt-8 border-t pt-8">
             <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span class="w-1.5 h-6 bg-green-500 rounded-full"></span>
                  交付内容
                </h3>
                <div class="flex items-center gap-2 text-xs text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                  <el-icon class="animate-pulse"><TimerIcon /></el-icon> 距离系统自动确认还剩：47小时58分
                </div>
             </div>

             <div class="bg-white border rounded-2xl p-6 space-y-6">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-[10px] text-gray-400 uppercase mb-1">提交人</p>
                    <p class="text-sm font-bold text-gray-700">{{ submission.submitter }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-gray-400 uppercase mb-1">提交时间</p>
                    <p class="text-sm font-bold text-gray-700">{{ submission.submitTime }}</p>
                  </div>
                </div>

                <div>
                   <p class="text-[10px] text-gray-400 uppercase mb-1">交付文件</p>
                   <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-dashed hover:border-blue-400 transition-colors group cursor-pointer">
                      <div class="w-10 h-12 bg-white border rounded flex items-center justify-center shrink-0">
                         <el-icon size="20" class="text-red-500"><DocumentIcon /></el-icon>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-gray-700 truncate">{{ submission.fileName }}</p>
                        <p class="text-[10px] text-gray-400">2.4 MB</p>
                      </div>
                      <div class="flex gap-2">
                        <el-button size="small" plain>预览</el-button>
                        <el-button size="small" type="primary" plain>下载查看</el-button>
                      </div>
                   </div>
                </div>

                <div>
                   <p class="text-[10px] text-gray-400 uppercase mb-1">提交说明</p>
                   <p class="text-xs text-gray-600 leading-relaxed">{{ submission.description }}</p>
                </div>
             </div>

             <div class="mt-8 flex gap-4">
                <el-button 
                  type="success" 
                  class="flex-1 !h-14 !rounded-xl !text-lg !font-bold"
                  @click="handleAccept"
                >
                  确认完成 (支付 ¥{{ task.reward }})
                </el-button>
                <el-button 
                  type="danger" 
                  plain 
                  class="!h-14 !px-10 !rounded-xl !text-lg !font-bold"
                  @click="handleReject"
                >
                  退回修改
                </el-button>
             </div>
          </div>

          <!-- Bottom Action (Generic) -->
          <div v-else class="mt-8 flex flex-col items-center">
            <template v-if="task.status === TaskStatus.PENDING">
              <el-button 
                type="success" 
                class="!h-16 !px-20 !rounded-2xl !text-xl !font-black !shadow-xl !shadow-green-100 hover:-translate-y-1 transition-transform"
                @click="handleUndertake"
              >
                立即承接此任务 (¥{{ task.reward }})
              </el-button>
              <p class="text-xs text-gray-400 mt-4">承接后请在 24 小时内提交相关文档资料</p>
            </template>
            <template v-else-if="task.status === TaskStatus.IN_PROGRESS">
               <el-tag size="large" type="warning" class="!px-10 !h-12 !rounded-xl font-bold">任务进行中</el-tag>
            </template>
            <template v-else-if="task.status === TaskStatus.REVIEWING">
               <el-tag size="large" type="warning" class="!px-10 !h-12 !rounded-xl font-bold">待验收中</el-tag>
            </template>
            <template v-else-if="task.status === TaskStatus.COMPLETED">
               <el-tag size="large" type="success" class="!px-10 !h-12 !rounded-xl font-bold">任务已完成</el-tag>
            </template>
            <template v-else>
               <el-tag size="large" type="info" class="!px-10 !h-12 !rounded-xl font-bold">任务已关闭</el-tag>
            </template>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="bg-blue-50/30 border border-blue-100 rounded-2xl p-8">
        <h4 class="text-blue-900 font-bold mb-4 flex items-center gap-2">
          <el-icon><InfoFilledIcon /></el-icon> 承接温馨提示
        </h4>
        <ul class="space-y-3 text-sm text-blue-800/70">
          <li class="flex items-start gap-2">
            <span class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] shrink-0 font-bold">1</span>
            承接任务后，请在 24 小时内通过系统提交相关资料，逾期任务将重新释放。
          </li>
          <li class="flex items-start gap-2">
            <span class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] shrink-0 font-bold">2</span>
            提交的内容需经过发布人与平台审核，确认无误后悬赏金将直接进入您的余额。
          </li>
          <li class="flex items-start gap-2">
            <span class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] shrink-0 font-bold">3</span>
            高质量的交付将获得发布人的“采纳”和“好评”，极大地提升您的达人信誉分。
          </li>
          <li class="flex items-start gap-2">
            <span class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] shrink-0 font-bold">4</span>
            请勿提交刷屏、虚假或侵权内容，违规行为可能导致账号封禁。
          </li>
        </ul>
      </div>
    </div>
  </AppLayout>
  <el-empty v-else class="py-20" description="未找到该任务" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { User, Calendar, InfoFilled, Timer, Document } from '@element-plus/icons-vue'
import { mockTasks } from '@/mock'
import { TaskStatus } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useMainStore } from '@/store'

const UserIcon = markRaw(User)
const CalendarIcon = markRaw(Calendar)
const InfoFilledIcon = markRaw(InfoFilled)
const TimerIcon = markRaw(Timer)
const DocumentIcon = markRaw(Document)

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const taskId = route.params.id as string

const task = ref(mockTasks.find(t => t.id === taskId))

const isAcceptedByMe = computed(() => mainStore.acceptedTasks.includes(taskId))
const isIssuer = computed(() => task.value?.publisherId === mainStore.user?.id)

const submission = ref({
  submitter: '王小明 (信誉分: 98)',
  submitTime: '2026-05-19 14:30',
  fileName: '大型建筑项目可行性研究报告_完整版.pdf',
  description: '已经按照要求整理了完整的财务模型和风险分析，请您查收。'
})

const getStatusType = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.PENDING: return ''
    case TaskStatus.IN_PROGRESS: return 'warning'
    case TaskStatus.REVIEWING: return 'warning'
    case TaskStatus.COMPLETED: return 'success'
    case TaskStatus.EXPIRED: return 'info'
    default: return ''
  }
}

const getStatusText = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.PENDING: return '等待认领'
    case TaskStatus.IN_PROGRESS: return '进行中'
    case TaskStatus.REVIEWING: return '待验收'
    case TaskStatus.COMPLETED: return '已获赏'
    case TaskStatus.EXPIRED: return '已过期'
    default: return '未知'
  }
}

const checkAuth = (action: string) => {
  if (!mainStore.user) {
    ElMessage.warning(`请先登录后再进行${action}`)
    router.push('/login')
    return false
  }
  return true
}

const handleUndertake = () => {
  if (!checkAuth('承接任务')) return
  
  if (mainStore.user?.score < 60) {
    ElMessage.error('您的信誉分过低，无法承接悬赏任务')
    return
  }

  ElMessageBox.confirm(
    `确认承接此任务吗？承接后需在 24 小时内完成。任务报酬：¥${task.value?.reward}`,
    '承接任务确认',
    {
      confirmButtonText: '立即承接',
      cancelButtonText: '再想想',
      type: 'success',
      roundButton: true
    }
  ).then(() => {
    mainStore.acceptTask(taskId)
    ElMessage.success('您已成功承接该任务！请尽快开始准备资料')
    if (task.value) {
      task.value.status = TaskStatus.IN_PROGRESS
    }
  }).catch(() => {})
}

const handleAccept = () => {
  if (!isIssuer.value) return
  
  ElMessageBox.confirm(
    '确认通过该交付物并结项吗？确认后悬赏金将直接划拨给承接人。',
    '确认完成任务',
    {
      confirmButtonText: '确认交付',
      cancelButtonText: '取消',
      type: 'success',
      roundButton: true
    }
  ).then(() => {
    // Logic: creator's earnings increase + reputation increase (mocking)
    if (mainStore.user) {
      mainStore.user.balance += task.value?.reward || 0
      mainStore.user.score += 2
      mainStore.setUser(mainStore.user)
    }
    
    ElMessage.success('验收通过，收益已入账，信誉分 +2！')
    if (task.value) {
      task.value.status = TaskStatus.COMPLETED
    }
  }).catch(() => {})
}

const handleReject = () => {
  ElMessageBox.prompt('请输入退回修改的理由：', '退回修改', {
    confirmButtonText: '确定退回',
    cancelButtonText: '取消',
    inputPlaceholder: '例如：补充财务分析的第三部分内容...',
    roundButton: true
  }).then(({ value }) => {
    ElMessage.warning(`任务已退回：${value}`)
    if (task.value) {
      task.value.status = TaskStatus.IN_PROGRESS
    }
  }).catch(() => {})
}
</script>
