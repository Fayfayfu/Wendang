<template>
  <div class="max-w-3xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-black text-gray-900 mb-8 text-center">发布悬赏任务</h1>
    
    <div class="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
      <el-form :model="form" label-position="top" size="large">
        <el-form-item label="任务标题">
          <el-input v-model="form.title" placeholder="如：急求XX工程施工图纸一份" shadow="none" />
        </el-form-item>
        
        <div class="grid grid-cols-2 gap-6">
          <el-form-item label="悬赏金额 (元)">
            <el-input-number v-model="form.reward" :min="1" class="!w-full" />
          </el-form-item>
          <el-form-item label="截止日期">
            <el-date-picker v-model="form.deadline" type="date" placeholder="选择截止时间" class="!w-full" />
          </el-form-item>
        </div>

        <el-form-item label="任务分类">
          <el-select v-model="form.category" placeholder="选择分类" class="!w-full">
            <el-option label="考研资料" value="kaoyan" />
            <el-option label="工程图纸" value="engineering" />
            <el-option label="法律合同" value="law" />
            <el-option label="代码编程" value="code" />
          </el-select>
        </el-form-item>

        <el-form-item label="任务详细说明">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="6" 
            placeholder="请详细描述对文档的需求，包括格式、内容要求等..." 
          />
        </el-form-item>

        <div class="pt-4">
          <el-button type="primary" class="!w-full !rounded-full !h-12 !text-lg !font-bold" @click="handleSubmit">
            确认发布任务
          </el-button>
          <p class="text-center text-xs text-gray-400 mt-4">发布后将扣除对应的悬赏金额作为押金，任务完成后结算</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = ref({
  title: '',
  reward: 50,
  deadline: '',
  category: '',
  description: ''
})

const handleSubmit = () => {
  ElMessage.success('任务发布成功！正在审核中...')
  router.push('/tasks')
}
</script>
