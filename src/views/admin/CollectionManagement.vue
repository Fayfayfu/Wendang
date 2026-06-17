<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索文集标题..." 
          class="!w-64" 
          clearable
          :prefix-icon="SearchIcon"
        />
        <el-button type="primary" :icon="SearchIcon">查询</el-button>
      </div>
    </div>

    <div class="p-4">
      <el-table :data="mockCollections" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="文集封面" width="100">
          <template #default="{ row }">
            <el-image :src="row.cover" class="w-12 h-16 rounded shadow-sm object-cover" />
          </template>
        </el-table-column>
        <el-table-column label="标题" min-width="200">
          <template #default="{ row }">
            <div class="font-bold text-gray-800 text-sm">{{ row.title }}</div>
            <div class="text-[10px] text-gray-400">包含 {{ row.items.length }} 个文档</div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isPublic ? 'success' : 'info'" size="small">
              {{ row.isPublic ? '上架中' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button link :type="row.isPublic ? 'warning' : 'success'" @click="togglePublic(row)">
              {{ row.isPublic ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { mockCollections } from '@/mock'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const SearchIcon = markRaw(Search)
const searchQuery = ref('')

const togglePublic = (collection: any) => {
  collection.isPublic = !collection.isPublic
  ElMessage.success(`文集《${collection.title}》已${collection.isPublic ? '上架' : '下架'}`)
}
</script>
