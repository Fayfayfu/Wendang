<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索用户名/手机号..." 
          class="!w-64" 
          clearable
          :prefix-icon="SearchIcon"
        />
        <el-button type="primary" :icon="SearchIcon">查询</el-button>
      </div>
    </div>

    <div class="p-4">
      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-avatar :size="32" :src="row.avatar" />
              <div>
                <div class="font-bold text-gray-800 text-sm">{{ row.nickname }}</div>
                <div class="text-[10px] text-gray-400">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'" size="small">
              {{ row.status === 0 ? '正常' : '已封禁' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="VIP" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.isVip" type="warning" size="small" effect="dark">VIP</el-tag>
            <span v-else class="text-gray-400 text-xs">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="信誉分" width="100">
          <template #default="{ row }">
            <span :class="row.score < 60 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'">{{ row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEditCredit(row)">信誉分</el-button>
            <el-divider direction="vertical" />
            <el-button link :type="row.status === 0 ? 'danger' : 'success'" @click="toggleBan(row)">
               {{ row.status === 0 ? '封禁' : '解封' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Credit Adjustment Dialog -->
    <el-dialog v-model="creditDialogVisible" title="调整信誉分" width="400">
      <el-form label-width="80px">
        <el-form-item label="当前分数">
          <span class="font-bold">{{ currentUser?.score }}</span>
        </el-form-item>
        <el-form-item label="调整分值">
          <el-input-number v-model="creditForm.change" :min="-100" :max="100" />
        </el-form-item>
        <el-form-item label="理由">
          <el-input v-model="creditForm.reason" type="textarea" placeholder="请输入调整理由" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="creditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreditAdjustment">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { mockUsers } from '@/mock'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const SearchIcon = markRaw(Search)
const searchQuery = ref('')
const creditDialogVisible = ref(false)
const currentUser = ref<any>(null)
const creditForm = ref({
  change: 0,
  reason: ''
})

const filteredUsers = computed(() => {
  return mockUsers.filter(u => 
    u.nickname.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    (u.phone && u.phone.includes(searchQuery.value))
  )
})

const handleEditCredit = (user: any) => {
  currentUser.value = user
  creditForm.value = { change: 0, reason: '' }
  creditDialogVisible.value = true
}

const submitCreditAdjustment = () => {
  if (currentUser.value) {
    currentUser.value.score += creditForm.value.change
    ElMessage.success(`用户 ${currentUser.value.nickname} 的信誉分已调整`)
    creditDialogVisible.value = false
  }
}

const toggleBan = (user: any) => {
  const action = user.status === 0 ? '封禁' : '解封'
  ElMessageBox.confirm(`确定要${action}用户 ${user.nickname} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    user.status = user.status === 0 ? 1 : 0
    ElMessage.success(`用户已${action}`)
  })
}
</script>
