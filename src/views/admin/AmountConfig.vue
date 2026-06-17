<template>
  <div class="max-w-2xl">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
      <div>
        <h3 class="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
          <el-icon class="text-blue-500"><Money /></el-icon>
          收益与抽佣配置
        </h3>
        <el-form label-position="top">
          <el-form-item label="平台文档交易抽佣比例 (0-100%)">
             <div class="flex items-center gap-4">
               <el-slider v-model="commissionRate" :min="0" :max="50" class="flex-1" />
               <span class="w-12 text-right font-bold text-blue-600">{{ commissionRate }}%</span>
             </div>
             <p class="text-[10px] text-gray-400 mt-1">当前设定：每售出一份文档，平台抽取 {{ commissionRate }}% 作为技术服务费。</p>
          </el-form-item>

          <el-form-item label="任务发布保证金比例" class="mt-6">
             <div class="flex items-center gap-4">
               <el-slider v-model="taskDeposit" :min="10" :max="100" class="flex-1" />
               <span class="w-12 text-right font-bold text-blue-600">{{ taskDeposit }}%</span>
             </div>
             <p class="text-[10px] text-gray-400 mt-1">用户发布任务时需预缴的金额比例。</p>
          </el-form-item>
        </el-form>
      </div>

      <el-divider />

      <div>
        <h3 class="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
          <el-icon class="text-orange-500"><Wallet /></el-icon>
          提现门槛设置
        </h3>
        <el-form label-width="120px">
          <el-form-item label="单次最低提现">
            <el-input-number v-model="minWithdraw" :min="10" :step="10" />
            <span class="ml-4 text-xs text-gray-400">元</span>
          </el-form-item>
          <el-form-item label="单日最高提现">
            <el-input-number v-model="maxWithdrawDaily" :min="500" :step="500" />
            <span class="ml-4 text-xs text-gray-400">元</span>
          </el-form-item>
          <el-form-item label="提现审核时长">
             <el-select v-model="withdrawAuditTime" class="w-48">
               <el-option label="24小时内" value="24h" />
               <el-option label="1-3个工作日" value="1-3d" />
               <el-option label="3-7个工作日" value="3-7d" />
             </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="pt-4 flex justify-end gap-3">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSave">保存全局配置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Money, Wallet } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const commissionRate = ref(20)
const taskDeposit = ref(100)
const minWithdraw = ref(10)
const maxWithdrawDaily = ref(5000)
const withdrawAuditTime = ref('1-3d')

const handleReset = () => {
  commissionRate.value = 20
  taskDeposit.value = 100
  minWithdraw.value = 10
  withdrawAuditTime.value = '1-3d'
}

const handleSave = () => {
  ElMessage.success('金额配置已更新并实时生效')
}
</script>
