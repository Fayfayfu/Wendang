<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索文档标题..." 
          class="!w-64" 
          clearable
          :prefix-icon="SearchIcon"
        />
        <el-select v-model="statusFilter" placeholder="审核状态" class="!w-32">
          <el-option label="全部" value="" />
          <el-option label="已发布" :value="1" />
          <el-option label="审核中" :value="0" />
        </el-select>
        <el-button type="primary" :icon="SearchIcon">查询</el-button>
      </div>
    </div>

    <div class="p-4">
      <el-table :data="filteredDocuments" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="标题" min-width="250" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <span class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">{{ row.format.toUpperCase() }}</span>
              <span class="font-medium text-gray-700">{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            <span class="text-orange-600 font-bold">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status === 1 ? '已发布' : '审核中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleReview(row)">详情</el-button>
            <el-divider direction="vertical" />
            <template v-if="row.status === 0">
              <el-button link type="success" @click="handleAudit(row, 1)">通过</el-button>
              <el-divider direction="vertical" />
              <el-button link type="danger" @click="handleAudit(row, -1)">驳回</el-button>
            </template>
            <template v-else>
              <el-button link type="warning" @click="handleAudit(row, 0)">下架</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { mockDocuments } from '@/mock'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const SearchIcon = markRaw(Search)
const searchQuery = ref('')
const statusFilter = ref<number | ''>('')

const filteredDocuments = computed(() => {
  return mockDocuments.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = statusFilter.value === '' || doc.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

const getStatusType = (status: number) => {
  if (status === 1) return 'success'
  if (status === 0) return 'info'
  return 'danger'
}

const handleReview = (doc: any) => {
  ElMessage.info(`查看文档《${doc.title}》详情`)
}

const handleAudit = (doc: any, status: number) => {
  doc.status = status
  const msg = status === 1 ? '已发布' : status === 0 ? '已下架' : '已驳回'
  ElMessage.success(`文档《${doc.title}》${msg}`)
}
</script>
