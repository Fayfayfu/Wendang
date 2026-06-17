<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <el-input v-model="searchQuery" placeholder="搜索任务标题..." class="!w-64" clearable :prefix-icon="SearchIcon" />
        <el-select v-model="statusFilter" placeholder="任务状态" class="!w-32">
          <el-option label="全部" value="" />
          <el-option label="进行中" value="processing" />
          <el-option label="待审核" value="checking" />
          <el-option label="已完成" value="finished" />
        </el-select>
        <el-button type="primary" :icon="SearchIcon">查询</el-button>
      </div>
    </div>

    <div class="p-4">
      <el-table :data="mockTasks" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="任务标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="issuerName" label="发布者" width="120" />
        <el-table-column label="悬赏金额" width="120">
          <template #default="{ row }">
            <span class="text-orange-600 font-bold">¥{{ row.reward }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDeliverables(row)">查看交付物</el-button>
            <el-divider v-if="row.status === 'checking'" direction="vertical" />
            <el-button v-if="row.status === 'checking'" link type="success" @click="handleAudit(row, 'finished')">通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { mockTasks } from '@/mock'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const SearchIcon = markRaw(Search)
const searchQuery = ref('')
const statusFilter = ref('')

const getStatusType = (status: string) => {
  const map: any = { processing: 'primary', checking: 'warning', finished: 'success' }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: any = { processing: '进行中', checking: '待审核', finished: '已完成' }
  return map[status] || status
}

const viewDeliverables = (task: any) => {
  ElMessageBox.alert('交付内容：考研复试真题电子版.pdf (已上传云存储)', `任务交付物 - ${task.title}`)
}

const handleAudit = (task: any, newStatus: string) => {
  task.status = newStatus
  ElMessage.success('任务验收成功，奖励已发放')
}
</script>
