<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- LLM Provider Config -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 class="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
          <el-icon class="text-indigo-600"><MagicStick /></el-icon>
          AI 模型供应商
        </h3>
        <el-form label-position="top">
          <el-form-item label="主用模型供应商">
            <el-radio-group v-model="provider" class="w-full">
              <div class="grid grid-cols-2 gap-4 w-full">
                <el-radio-button label="gemini" class="w-full">Google Gemini</el-radio-button>
                <el-radio-button label="openai" class="w-full">OpenAI (GPT-4)</el-radio-button>
                <el-radio-button label="claude" class="w-full">Anthropic Claude</el-radio-button>
                <el-radio-button label="deepseek" class="w-full">DeepSeek V3</el-radio-button>
              </div>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="API Key">
            <el-input v-model="apiKey" type="password" show-password placeholder="请输入密钥" />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="最大上下文长度">
                <el-select v-model="contextLength" class="w-full">
                  <el-option label="32k" value="32k" />
                  <el-option label="128k" value="128k" />
                  <el-option label="1M" value="1m" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生成温度 (Temperature)">
                <el-slider v-model="temp" :min="0" :max="2" :step="0.1" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="mt-8 pt-6 border-t flex justify-end gap-3">
          <el-button type="info" plain @click="testConnection">连接测试</el-button>
          <el-button type="primary" @click="handleSave">保存配置</el-button>
        </div>
      </div>

      <!-- AI Usage Stats -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 class="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
          <el-icon class="text-green-600"><DataLine /></el-icon>
          本月额度使用统计
        </h3>
        
        <div class="space-y-6">
          <div>
            <div class="flex justify-between text-xs mb-2">
              <span class="text-gray-500 font-medium">API Token 消耗 (已用 / 总额)</span>
              <span class="font-bold">4.2M / 10M</span>
            </div>
            <el-progress :percentage="42" stroke-width="12" :format="(p: number) => p + '%'" stroke-linecap="round" />
          </div>

          <el-row :gutter="20">
            <el-col :span="12">
              <div class="p-4 rounded-xl bg-gray-50 border">
                <p class="text-[10px] text-gray-400 mb-1">今日调用次数</p>
                <p class="text-2xl font-black text-gray-900">1,280</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="p-4 rounded-xl bg-gray-50 border">
                <p class="text-[10px] text-gray-400 mb-1">平均响应时长</p>
                <p class="text-2xl font-black text-gray-900">1.4s</p>
              </div>
            </el-col>
          </el-row>

          <div class="p-6 rounded-xl bg-blue-50 border border-blue-100">
            <h4 class="text-sm font-bold text-blue-800 mb-2">成本估算</h4>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-black text-blue-600">$ 42.18</span>
              <span class="text-xs text-blue-400">≈ ¥ 304.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MagicStick, DataLine } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const provider = ref('gemini')
const apiKey = ref('AIzaSyD*******************')
const contextLength = ref('128k')
const temp = ref(0.7)

const handleSave = () => {
  ElMessage.success('供应商配置已安全加密并保存')
}

const testConnection = () => {
  ElMessage.success('Ping 成功！当前模型响应延迟: 840ms')
}
</script>
