<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center gap-4 mb-6">
        <el-input 
          v-model="searchPhone" 
          placeholder="请输入用户手机号查询信誉详情..." 
          class="!w-96" 
          :prefix-icon="SearchIcon"
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>

      <div v-if="targetUser" class="border rounded-xl p-6 bg-gray-50 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <el-avatar :size="64" :src="targetUser.avatar" />
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ targetUser.nickname }}</h3>
            <p class="text-sm text-gray-500">{{ targetUser.phone }}</p>
          </div>
        </div>
        <div class="text-center px-10 border-x">
          <p class="text-xs text-gray-400 mb-1">当前信誉分</p>
          <p :class="['text-4xl font-black', targetUser.score < 60 ? 'text-red-500' : 'text-green-600']">{{ targetUser.score }}</p>
        </div>
        <el-button type="primary" size="large" @click="showAdjust = true">调整分值</el-button>
      </div>
      <el-empty v-else description="请输入有效手机号搜索用户" />
    </div>

    <div v-if="targetUser" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b font-bold text-gray-700">变化日志</div>
      <el-table :data="mockCreditLogs" style="width: 100%">
        <el-table-column prop="createdAt" label="时间" width="180" />
        <el-table-column label="变动" width="100">
          <template #default="{ row }">
            <span :class="row.change > 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'">
              {{ row.change > 0 ? '+' : '' }}{{ row.change }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="具体原因" min-width="200" />
      </el-table>
    </div>

    <!-- Adjust Dialog -->
    <el-dialog v-model="showAdjust" title="人工干预信誉分" width="400">
      <el-form label-width="80px">
        <el-form-item label="分值变动">
          <el-input-number v-model="form.change" :min="-100" :max="100" />
        </el-form-item>
        <el-form-item label="干预理由">
          <el-input v-model="form.reason" type="textarea" placeholder="例：核实为恶意灌水，情节严重" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdjust = false">取消</el-button>
        <el-button type="primary" @click="submitAdjust">确认调整</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { mockUsers, mockCreditLogs } from '@/mock'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const SearchIcon = markRaw(Search)
const searchPhone = ref('')
const targetUser = ref<any>(null)
const showAdjust = ref(false)
const form = ref({ change: 0, reason: '' })

const handleSearch = () => {
  const user = mockUsers.find(u => u.phone && u.phone.includes(searchPhone.value))
  if (user) {
    targetUser.value = user
  } else {
    ElMessage.error('用户不存在')
    targetUser.value = null
  }
}

const submitAdjust = () => {
  if (targetUser.value) {
    targetUser.value.score += form.value.change
    ElMessage.success('调整成功')
    showAdjust.value = false
  }
}
</script>
