<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4">
      <el-table :data="mockReports" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="reason" label="举报类型" min-width="150" show-overflow-tooltip />
        <el-table-column prop="reporterId" label="举报人 ID" width="120" />
        <el-table-column prop="targetId" label="被举报内容 ID" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ row.status === 'pending' ? '待处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="举报时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">查看依据</el-button>
            <el-divider v-if="row.status === 'pending'" direction="vertical" />
            <template v-if="row.status === 'pending'">
              <el-button link type="danger" @click="handleReport(row, 'verified')">核实违规</el-button>
              <el-divider direction="vertical" />
              <el-button link type="info" @click="handleReport(row, 'malicious')">恶意举报</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockReports } from '@/mock'
import { ElMessage, ElMessageBox } from 'element-plus'

const viewDetail = (report: any) => {
  ElMessageBox.alert('证据：该文档包含违规广告链接，截图已存档。', `举报详情 - ${report.reason}`)
}

const handleReport = (report: any, action: string) => {
  report.status = 'handled'
  const msg = action === 'verified' ? '举报已核实，相关内容已下架' : '确认为恶意举报，已驳回并扣除举报人信誉分'
  ElMessage.success(msg)
}
</script>
