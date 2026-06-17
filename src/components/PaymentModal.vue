<template>
  <el-dialog
    v-model="visibleModel"
    title="收银台"
    width="480"
    align-center
    class="payment-dialog"
    @closed="handleClosed"
  >
    <div class="py-2">
      <!-- Item Info -->
      <div class="bg-gray-50 rounded-2xl p-6 mb-8 flex justify-between items-center border border-gray-100">
        <div class="min-w-0 flex-1">
          <p class="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">支付项目</p>
          <h4 class="font-bold text-gray-900 truncate leading-tight">{{ title }}</h4>
        </div>
        <div class="text-right ml-4">
          <p class="text-[10px] text-gray-400 mb-1">应付金额</p>
          <div class="text-2xl font-black text-orange-600">¥ {{ price.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Payment Success State -->
      <div v-if="payStatus === 'success'" class="py-6 text-center">
        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <el-icon :size="32"><Check /></el-icon>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">支付完成</h3>
        <p class="text-sm text-gray-500 mb-8">感谢支持，您现在可以下载该文档了</p>
        <el-button type="primary" size="large" class="w-full h-12 rounded-xl font-bold" @click="visibleModel = false">
          立即前往下载
        </el-button>
      </div>

      <!-- Payment Processing State -->
      <div v-else-if="payStatus === 'processing'" class="py-12 text-center">
        <el-icon class="is-loading text-blue-600 mb-4" :size="48"><Loading /></el-icon>
        <p class="text-gray-900 font-bold">正在确认支付状态...</p>
        <p class="text-xs text-gray-400 mt-2">请在您的设备上完成支付操作</p>
      </div>

      <!-- Initial State / Method Selection -->
      <div v-else>
        <h5 class="font-bold text-sm text-gray-900 mb-4 px-1">选择支付方式</h5>
        <div class="space-y-3 mb-8">
          <!-- WeChat Pay -->
          <div 
            class="payment-method-item"
            :class="{ 'active border-green-500 bg-green-50/20': selectedMethod === 'wechat' }"
            @click="selectedMethod = 'wechat'"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                <el-icon :size="20"><ChatDotRound /></el-icon>
              </div>
              <div>
                <p class="font-bold text-sm">微信支付</p>
                <p class="text-[10px] text-gray-400">WeChat Pay</p>
              </div>
            </div>
            <el-radio v-model="selectedMethod" label="wechat"><span></span></el-radio>
          </div>

          <!-- Alipay -->
          <div 
            class="payment-method-item"
            :class="{ 'active border-blue-500 bg-blue-50/20': selectedMethod === 'alipay' }"
            @click="selectedMethod = 'alipay'"
          >
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                <el-icon :size="20"><Connection /></el-icon>
              </div>
              <div>
                <p class="font-bold text-sm">支付宝支付</p>
                <p class="text-[10px] text-gray-400">Alipay</p>
              </div>
            </div>
            <el-radio v-model="selectedMethod" label="alipay"><span></span></el-radio>
          </div>
        </div>

        <!-- WeChat QR Code -->
        <div v-if="selectedMethod === 'wechat'" class="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
          <div class="inline-block p-2 bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
            <img 
              :src="`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PAY_WENDANG_${title}_${price}`"
              class="w-32 h-32 opacity-90"
              alt="qrcode"
            />
          </div>
          <p class="text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <el-icon><Cellphone /></el-icon> 请使用微信扫码支付
          </p>
          <div class="mt-4">
            <el-button link type="primary" size="small" @click="simulatePaySuccess">支付遇到困难？</el-button>
          </div>
        </div>

        <!-- Alipay Action -->
        <div v-else class="text-center py-6">
          <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <el-icon :size="32"><Right /></el-icon>
          </div>
          <p class="text-sm text-gray-500 mb-6 px-8">点击下方按钮将跳转至支付宝收银台进行安全支付</p>
          <el-button 
            type="primary" 
            size="large" 
            class="w-full h-12 rounded-xl font-bold shadow-lg shadow-blue-100"
            @click="handleAlipaySubmit"
          >
            立即前往支付
          </el-button>
        </div>
      </div>
      
      <p class="text-[10px] text-center text-gray-300 mt-8 italic">
        支付即代表您同意《稳当文档支付服务协议》及《退款政策》
      </p>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Check, Loading, ChatDotRound, Connection, 
  Cellphone, Right 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  visible: boolean
  title: string
  price: number
}>()

const emit = defineEmits(['update:visible', 'success'])

const visibleModel = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const selectedMethod = ref<'wechat' | 'alipay'>('wechat')
const payStatus = ref<'idle' | 'processing' | 'success' | 'failed'>('idle')

const handleAlipaySubmit = () => {
  payStatus.value = 'processing'
  // Mock jumping to alipay and processing
  setTimeout(() => {
    simulatePaySuccess()
  }, 2000)
}

const simulatePaySuccess = () => {
  payStatus.value = 'success'
  ElMessage.success('文档支付成功！')
  emit('success')
}

const handleClosed = () => {
  // Reset state when dialog closed
  payStatus.value = 'idle'
  selectedMethod.value = 'wechat'
}
</script>

<style scoped>
.payment-method-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #f3f4f6;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}
.payment-method-item:hover {
  border-color: #e5e7eb;
}
.payment-method-item.active {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
}
:deep(.el-radio__label) {
  display: none;
}
</style>
