<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto py-12 px-4">
      <!-- Upload Header -->
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-black text-gray-900 mb-2">上传文档</h1>
        <p class="text-gray-500">分享知识，赚取收益。支持 PDF, Word, Excel, PPT, TXT 格式。</p>
      </div>

      <!-- Main Step Container -->
      <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        <el-steps :active="currentStep" finish-status="success" align-center class="mb-12">
          <el-step title="上传文件" />
          <el-step title="完善信息" />
          <el-step title="定价审核" />
        </el-steps>

        <!-- Step 1: Drag & Drop -->
        <div v-if="currentStep === 0" class="py-10">
          <el-upload
            class="upload-area"
            drag
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="false"
            accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.txt"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip text-center mt-6 space-y-2">
                <p class="text-gray-400">支持格式：DOC/PPT/PDF/XLS/TXT，单文件最大 100MB</p>
                <p class="flex items-center justify-center gap-2 text-xs text-orange-500">
                  <el-icon><Warning /></el-icon> 请勿上传违规、涉密或侵权内容
                </p>
              </div>
            </template>
          </el-upload>
        </div>

        <!-- Step 2: Metadata -->
        <div v-else-if="currentStep === 1" class="max-w-2xl mx-auto space-y-8">
          <div class="flex items-center gap-4 bg-blue-50 p-4 rounded-xl mb-8">
            <div class="w-12 h-16 bg-white rounded shadow-sm flex items-center justify-center border">
              <el-icon :size="24" class="text-blue-500"><Document /></el-icon>
            </div>
            <div class="flex-1 min-w-0">
               <p class="text-sm font-bold truncate">{{ uploadFile?.name }}</p>
               <p class="text-xs text-gray-400 mt-1">{{ (uploadFile?.size / 1024 / 1024).toFixed(2) }} MB</p>
            </div>
            <el-button link type="primary" @click="currentStep = 0">更换文件</el-button>
          </div>

          <el-form :model="docForm" :rules="rules" label-position="top" size="large">
            <el-form-item label="文档标题" prop="title">
              <el-input v-model="docForm.title" placeholder="请输入清晰的标题，便于他人搜索" />
            </el-form-item>

            <div class="grid grid-cols-2 gap-6">
              <el-form-item label="所属分类" prop="category">
                <el-select v-model="docForm.category" placeholder="请选择分类" class="w-full">
                  <el-option label="考研" value="考研" />
                  <el-option label="公考" value="公考" />
                  <el-option label="编程" value="编程" />
                  <el-option label="设计" value="设计" />
                  <el-option label="财会" value="财会" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="标签" prop="tags">
                <el-select
                  v-model="docForm.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="输入标签并回车"
                  class="w-full"
                >
                  <el-option label="精品" value="精品" />
                  <el-option label="最新" value="最新" />
                  <el-option label="实战" value="实战" />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="文档简介" prop="description">
              <el-input 
                v-model="docForm.description" 
                type="textarea" 
                :rows="4" 
                placeholder="简短描述文档内容，如包含的章节、重点等..." 
              />
            </el-form-item>

            <div class="pt-6 border-t flex justify-end gap-4">
               <el-button @click="currentStep = 0">上一步</el-button>
               <el-button type="primary" class="px-8" @click="currentStep = 2">下一步：定价设置</el-button>
            </div>
          </el-form>
        </div>

        <!-- Step 3: Pricing & Finish -->
        <div v-else-if="currentStep === 2" class="max-w-2xl mx-auto space-y-10 py-4">
           <div>
             <h3 class="font-bold text-gray-800 mb-6 flex items-center gap-2">
               <el-icon class="text-blue-600"><PriceTag /></el-icon>
               定价模式
             </h3>
             <div class="grid grid-cols-3 gap-6">
               <div 
                v-for="mode in priceModes" 
                :key="mode.value"
                class="relative border-2 rounded-xl p-4 cursor-pointer transition-all"
                :class="docForm.priceMode === mode.value ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'"
                @click="docForm.priceMode = mode.value"
               >
                 <div class="flex flex-col items-center text-center gap-3">
                   <el-icon :size="24" :class="docForm.priceMode === mode.value ? 'text-blue-600' : 'text-gray-400'">
                     <component :is="mode.icon" />
                   </el-icon>
                   <div>
                     <p class="font-bold text-sm">{{ mode.label }}</p>
                     <p class="text-[10px] text-gray-400 mt-0.5">{{ mode.desc }}</p>
                   </div>
                 </div>
                 <el-icon v-if="docForm.priceMode === mode.value" class="absolute top-2 right-2 text-blue-600"><CircleCheck /></el-icon>
               </div>
             </div>
           </div>

           <div v-if="docForm.priceMode === 'paid'" class="bg-gray-50 p-6 rounded-xl">
             <el-form-item label="设置售价 (元)" class="!mb-0">
               <el-input-number v-model="docForm.priceValue" :min="1" :max="1000" class="w-full" />
               <p class="text-[10px] text-gray-400 mt-2">平台将收取 20% 技术服务费</p>
             </el-form-item>
           </div>

           <div v-if="uploadStatus === 'idle'" class="pt-8 border-t flex justify-end gap-4">
              <el-button @click="currentStep = 1">上一步</el-button>
              <el-button type="primary" size="large" class="px-10" @click="startUpload">确认并提交审核</el-button>
           </div>

           <!-- Uploading Progress -->
           <div v-else-if="uploadStatus === 'uploading'" class="py-10 text-center">
             <el-progress 
               type="circle" 
               :percentage="uploadProgress" 
               status="success" 
               :width="120"
               class="mb-6"
             />
             <h4 class="font-bold text-gray-900 mb-2">正在同步云端...</h4>
             <p class="text-sm text-gray-400">请保持页面不关闭，上传完成后将自动刷新</p>
           </div>

           <!-- Success State -->
           <div v-else-if="uploadStatus === 'success'" class="py-10">
              <el-result
                icon="success"
                title="文档发布成功"
                sub-title="您的文档已提交至平台人工审核，预计在 1-2 小时内完成。"
              >
                <template #extra>
                  <div class="flex gap-4">
                    <el-button type="primary" @click="router.push('/')">回到首页</el-button>
                    <el-button @click="resetUpload">继续上传</el-button>
                  </div>
                </template>
              </el-result>
              <div class="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4 mx-auto max-w-md">
                 <el-icon class="text-blue-500 mt-1" size="20"><InfoFilled /></el-icon>
                 <div class="text-sm text-blue-700 leading-relaxed">
                    <p class="font-bold mb-1">审核须知：</p>
                    <p>1. 审核期间您可以对文档信息进行编辑。</p>
                    <p>2. 审核通过后，该文档将自动展示在对应分类的列表中。</p>
                    <p>3. 如未通过审核，我们将通过站内信通知您具体理由。</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { 
  UploadFilled, Warning, Document, CircleCheck, 
  PriceTag, Sunny, ColdDrink, Star, InfoFilled 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const currentStep = ref(0)
const uploadFile = ref<any>(null)
const uploadStatus = ref<'idle' | 'uploading' | 'success'>('idle')
const uploadProgress = ref(0)

const docForm = reactive({
  title: '',
  category: '',
  tags: [],
  description: '',
  priceMode: 'free',
  priceValue: 10
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

const priceModes = [
  { label: '完全免费', value: 'free', icon: markRaw(Sunny), desc: '所有效户可直接下载' },
  { label: 'VIP 免费', value: 'vip', icon: markRaw(Star), desc: '仅 VIP 用户可免费下' },
  { label: '付费购买', value: 'paid', icon: markRaw(PriceTag), desc: '按设置的金额出售' }
]

const handleFileChange = (file: any) => {
  if (file.size > 100 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过 100MB')
    return
  }
  uploadFile.value = file
  docForm.title = file.name.replace(/\.[^/.]+$/, "") // Remove extension
  currentStep.value = 1
}

let progressTimer: any = null
const startUpload = () => {
  uploadStatus.value = 'uploading'
  uploadProgress.value = 0
  
  progressTimer = setInterval(() => {
    uploadProgress.value += 5
    if (uploadProgress.value >= 100) {
       clearInterval(progressTimer)
       uploadStatus.value = 'success'
    }
  }, 100)
}

const resetUpload = () => {
  currentStep.value = 0
  uploadFile.value = null
  uploadStatus.value = 'idle'
  docForm.title = ''
  docForm.category = ''
  docForm.tags = []
  docForm.description = ''
}

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer)
})
</script>

<style scoped>
.upload-area :deep(.el-upload-dragger) {
  padding: 80px 40px;
  border-radius: 20px;
  background-color: var(--el-fill-color-light);
  border: 2px dashed var(--el-border-color-lighter);
  transition: all 0.3s;
}
.upload-area :deep(.el-upload-dragger:hover) {
  border-color: var(--el-color-primary);
  background-color: #f0f7ff;
}
.upload-area :deep(.el-icon--upload) {
  font-size: 80px;
  color: var(--el-color-primary);
  margin-bottom: 20px;
}
</style>
