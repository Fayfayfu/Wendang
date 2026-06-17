<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4">
      <el-table :data="mockWorkOrders" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="工单标题" min-width="150" />
        <el-table-column prop="category" label="反馈分类" width="120" />
        <el-table-column prop="userId" label="提交用户ID" width="120" />
        <el-table-column label="优先级" width="100">
          <template #default="{ row }">
            <el-tag type="info" size="small">普通</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'open' ? 'warning' : 'success'" size="small">
              {{ row.status === 'open' ? '处理中' : '已回复' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleReply(row)">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Reply Dialog -->
    <el-dialog v-model="replyVisible" :title="`回复工单: ${currentTicket?.title}`" width="500">
      <div class="mb-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p class="font-bold mb-1">问题描述：</p>
        <p>{{ currentTicket?.content }}</p>
      </div>
      <el-input v-model="replyText" type="textarea" :rows="4" placeholder="请输入您的回复..." />
      <template #footer>
        <el-button @click="replyVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">发送回复</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockWorkOrders } from '@/mock'
import { ElMessage } from 'element-plus'

const replyVisible = ref(false)
const currentTicket = ref<any>(null)
const replyText = ref('')

const handleReply = (ticket: any) => {
  currentTicket.value = ticket
  replyText.value = ''
  replyVisible.value = true
}

const submitReply = () => {
  if (!replyText.value) return ElMessage.warning('请输入回复内容')
  currentTicket.value.status = 'closed'
  ElMessage.success('工单回复成功')
  replyVisible.value = false
}
</script>
