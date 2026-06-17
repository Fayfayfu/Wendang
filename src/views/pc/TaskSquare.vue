<template>
  <AppLayout>
    <div class="py-6">
      <!-- 1. Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <el-icon class="text-orange-500"><BriefcaseIcon /></el-icon> 任务广场
          </h1>
          <p class="text-sm text-gray-500 mt-1">发布需求，悬赏文档，让专业的人帮你高效解决问题</p>
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <el-input 
            v-model="searchQuery" 
            placeholder="搜索任务标题..." 
            class="!w-full md:!w-64"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><SearchIcon /></el-icon>
            </template>
          </el-input>
          <el-button 
            type="primary" 
            size="large" 
            class="rounded-xl font-bold shadow-lg shadow-blue-100"
            @click="publishDialogVisible = true"
          >
            <el-icon class="mr-1"><PlusIcon /></el-icon>
            发布我的需求
          </el-button>
        </div>
      </div>

      <!-- Publish Task Dialog -->
      <el-dialog v-model="publishDialogVisible" title="发布悬赏任务" width="600" align-center append-to-body>
        <div class="py-2">
          <el-form :model="publishForm" label-position="top">
            <el-form-item label="任务标题" required>
              <el-input v-model="publishForm.title" placeholder="请简述您的需求，例如：求一份2026届XX大学考研复试资料" clearable />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="任务分类" required>
                  <el-select v-model="publishForm.category" class="w-full">
                    <el-option label="文档代找" value="文档代找" />
                    <el-option label="资料整理" value="资料整理" />
                    <el-option label="写作" value="写作" />
                    <el-option label="攻略" value="攻略" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截止日期" required>
                  <el-date-picker
                    v-model="publishForm.deadline"
                    type="date"
                    placeholder="选择日期"
                    class="!w-full"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="任务详情描述" required>
              <el-input
                v-model="publishForm.description"
                type="textarea"
                :rows="5"
                placeholder="请详细说明您的要求，越详细越容易被采纳..."
              />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="悬赏金额" required>
                  <el-input-number 
                    v-model="publishForm.reward" 
                    :min="5" 
                    :max="1000" 
                    :precision="2" 
                    :step="10"
                    controls-position="right"
                    class="!w-full"
                  />
                  <p class="text-[10px] text-gray-400 mt-1">最低 5.00 元起，金额越高越快被承接</p>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="任务加急 (置顶)">
                  <el-switch v-model="publishForm.isPinned" active-text="显示在列表顶部" />
                  <p class="text-[10px] text-gray-400 mt-1" v-if="publishForm.isPinned">需额外支付 ¥10.00 服务费</p>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div class="mt-8 flex justify-end gap-3">
            <el-button @click="publishDialogVisible = false" class="rounded-xl px-6">取消</el-button>
            <el-button type="primary" class="rounded-xl px-10 font-bold" @click="handleConfirmPublish">
              确认发布需求
            </el-button>
          </div>
        </div>
      </el-dialog>

      <!-- Payment Dialog -->
      <el-dialog v-model="paymentDialogVisible" title="支付悬赏金" width="400" align-center append-to-body>
        <div class="text-center py-4">
          <p class="text-gray-500 text-sm mb-2">应付总额</p>
          <div class="text-4xl font-black text-gray-900 mb-8 tracking-tighter">
            <span class="text-lg">¥</span>{{ totalAmount.toFixed(2) }}
          </div>
          
          <div class="space-y-3 mb-8">
            <div class="flex items-center justify-between p-4 border rounded-2xl cursor-pointer hover:border-blue-500 transition-colors" :class="payMethod === 'wechat' ? 'bg-blue-50 border-blue-500' : ''" @click="payMethod = 'wechat'">
              <div class="flex items-center gap-3">
                <img src="https://img.icons8.com/color/48/weixing.png" class="w-6 h-6" />
                <span class="text-sm font-medium">微信支付</span>
              </div>
              <el-icon v-if="payMethod === 'wechat'" class="text-blue-600"><CircleCheckFilledIcon /></el-icon>
            </div>
            <div class="flex items-center justify-between p-4 border rounded-2xl cursor-pointer hover:border-blue-500 transition-colors" :class="payMethod === 'alipay' ? 'bg-blue-50 border-blue-500' : ''" @click="payMethod = 'alipay'">
              <div class="flex items-center gap-3">
                <img src="https://img.icons8.com/color/48/alipay.png" class="w-6 h-6" />
                <span class="text-sm font-medium">支付宝支付</span>
              </div>
              <el-icon v-if="payMethod === 'alipay'" class="text-blue-600"><CircleCheckFilledIcon /></el-icon>
            </div>
          </div>

          <el-button 
            type="primary" 
            class="w-full !h-14 !rounded-2xl font-black text-lg shadow-xl shadow-blue-100"
            :loading="paying"
            @click="handlePay"
          >
            立即支付 (¥{{ totalAmount.toFixed(2) }})
          </el-button>
        </div>
      </el-dialog>

      <!-- 2. Filter & Sort Tabs -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div class="flex flex-col lg:flex-row items-center border-b">
          <div class="flex-1 w-full lg:w-auto">
            <el-tabs v-model="activeCategory" class="px-6 custom-tabs">
              <el-tab-pane label="全部" name="all" />
              <el-tab-pane label="文档代找" name="文档代找" />
              <el-tab-pane label="资料整理" name="资料整理" />
              <el-tab-pane label="写作" name="写作" />
              <el-tab-pane label="攻略" name="攻略" />
            </el-tabs>
          </div>
          <div class="p-4 border-t lg:border-t-0 lg:border-l flex items-center gap-6 text-sm text-gray-500 whitespace-nowrap">
            <span class="flex items-center gap-2 cursor-pointer transition-colors" 
              :class="sortBy === 'newest' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'"
              @click="sortBy = 'newest'">
              最新发布
            </span>
            <span class="flex items-center gap-2 cursor-pointer transition-colors"
              :class="sortBy === 'reward' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'"
              @click="sortBy = 'reward'">
              最高悬赏
            </span>
            <span class="flex items-center gap-2 cursor-pointer transition-colors"
              :class="sortBy === 'ending' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'"
              @click="sortBy = 'ending'">
              即将截止
            </span>
          </div>
        </div>
      </div>

      <!-- 3. Task List -->
      <div class="space-y-4">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all cursor-pointer group"
          @click="goToDetail(task.id)"
        >
          <!-- Task Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-3">
              <el-tag size="small" type="info" effect="plain" class="rounded-md">{{ task.category }}</el-tag>
              <el-tag 
                size="small" 
                :type="getStatusType(task.status)" 
                effect="dark" 
                class="rounded-md"
              >
                {{ getStatusText(task.status) }}
              </el-tag>
            </div>
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 truncate">
              {{ task.title }}
            </h3>
            <p class="text-sm text-gray-500 line-clamp-1 mb-4 leading-relaxed">
              {{ task.description }}
            </p>
            <div class="flex items-center gap-6 text-xs text-gray-400">
               <span class="flex items-center gap-1.5"><el-icon><CalendarIcon /></el-icon> 截止日期：{{ task.deadline }}</span>
               <span class="flex items-center gap-1.5"><el-icon><UserIcon /></el-icon> 承接人数：{{ getTakerCount(task) }}</span>
            </div>
          </div>

          <!-- Price & Action -->
          <div class="flex flex-col items-end justify-between py-1 border-t md:border-t-0 md:border-l md:pl-8 border-gray-50 shrink-0 min-w-[140px]">
            <div class="text-right">
              <p class="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">任务悬赏</p>
              <p class="text-2xl font-black text-rose-500 tracking-tight">
                <span class="text-sm font-normal">¥</span>{{ task.reward.toFixed(2) }}
              </p>
            </div>
            <el-button type="primary" plain class="rounded-xl mt-4 w-full md:w-auto">
              查看详情
            </el-button>
          </div>
        </div>
        
        <!-- Empty State -->
        <el-empty v-if="filteredTasks.length === 0" description="暂无符合条件的任务，换个分类看看吧" />
      </div>

      <!-- Pagination -->
      <div v-if="filteredTasks.length > 0" class="flex justify-center mt-12 mb-8">
        <el-pagination background layout="prev, pager, next" :total="50" />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, Plus, Briefcase, Calendar, User,
  CircleCheckFilled, SuccessFilled, Timer, Document
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import AppLayout from '@/components/AppLayout.vue'
import { mockTasks } from '@/mock'
import { TaskStatus } from '@/types'

const SearchIcon = markRaw(Search)
const PlusIcon = markRaw(Plus)
const BriefcaseIcon = markRaw(Briefcase)
const CalendarIcon = markRaw(Calendar)
const UserIcon = markRaw(User)
const CircleCheckFilledIcon = markRaw(CircleCheckFilled)
const SuccessFilledIcon = markRaw(SuccessFilled)

const router = useRouter()
const searchQuery = ref('')
const activeCategory = ref('all')
const sortBy = ref('newest')

const publishDialogVisible = ref(false)
const paymentDialogVisible = ref(false)
const paying = ref(false)
const payMethod = ref('wechat')

const publishForm = reactive({
  title: '',
  category: '文档代找',
  deadline: '',
  description: '',
  reward: 50,
  isPinned: false
})

const totalAmount = computed(() => {
  let total = publishForm.reward
  if (publishForm.isPinned) total += 10
  return total
})

const handleConfirmPublish = () => {
  console.log('Confirming publish...', JSON.parse(JSON.stringify(publishForm)))
  if (!publishForm.title || !publishForm.deadline || !publishForm.description) {
    ElMessage.warning('请填写完整的任务信息')
    return
  }
  publishDialogVisible.value = false
  paymentDialogVisible.value = true
}

const handlePay = () => {
  paying.value = true
  setTimeout(() => {
    paying.value = false
    paymentDialogVisible.value = false
    ElMessage({
      message: '支付成功！任务已提交并进入审核阶段。',
      type: 'success',
      duration: 5000
    })
    // Reset form
    Object.assign(publishForm, {
      title: '',
      category: '文档代找',
      deadline: '',
      description: '',
      reward: 50,
      isPinned: false
    })
  }, 2000)
}

const tasks = ref(mockTasks)

const filteredTasks = computed(() => {
  let result = tasks.value

  // Category filter
  if (activeCategory.value !== 'all') {
    result = result.filter(t => t.category === activeCategory.value)
  }

  // Search filter
  if (searchQuery.value) {
    result = result.filter(t => t.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  // Sort logic
  const cloned = [...result]
  if (sortBy.value === 'newest') {
    cloned.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } else if (sortBy.value === 'reward') {
    cloned.sort((a, b) => b.reward - a.reward)
  } else if (sortBy.value === 'ending') {
    cloned.sort((a, b) => a.deadline.localeCompare(b.deadline))
  }

  return cloned
})

const getStatusType = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.PENDING: return ''
    case TaskStatus.IN_PROGRESS: return 'warning'
    case TaskStatus.COMPLETED: return 'success'
    case TaskStatus.EXPIRED: return 'info'
    default: return ''
  }
}

const getStatusText = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.PENDING: return '等待认领'
    case TaskStatus.IN_PROGRESS: return '进行中'
    case TaskStatus.COMPLETED: return '已获赏'
    case TaskStatus.EXPIRED: return '已过期'
    default: return '未知'
  }
}

const getTakerCount = (task: any) => {
  // Mock taker count since it's not in the type
  if (task.status === TaskStatus.COMPLETED) return 1
  if (task.status === TaskStatus.IN_PROGRESS) return 1
  return Math.floor(Math.random() * 5)
}

const goToDetail = (id: string) => {
  router.push(`/task/${id}`)
}
</script>

<style scoped>
:deep(.custom-tabs .el-tabs__header) {
  margin-bottom: 0;
  border-bottom: none;
}
:deep(.custom-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.custom-tabs .el-tabs__item) {
  height: 64px;
  line-height: 64px;
  font-weight: 600;
  font-size: 15px;
}
</style>
