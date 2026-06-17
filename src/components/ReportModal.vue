<template>
  <el-dialog
    v-model="visible"
    title="举报文档"
    width="500"
    align-center
    append-to-body
    destroy-on-close
    class="rounded-3xl"
  >
    <div class="py-2">
      <div class="bg-gray-50 p-4 rounded-2xl mb-6 flex items-start gap-3 border border-gray-100">
        <el-icon class="mt-1 text-gray-400"><Document /></el-icon>
        <div>
          <p class="text-xs text-gray-400 mb-1">举报文档</p>
          <p class="text-sm font-bold text-gray-700">{{ targetTitle }}</p>
        </div>
      </div>

      <el-form :model="form" label-position="top">
        <el-form-item label="举报理由" required>
          <el-radio-group v-model="form.type" class="!flex flex-col items-start gap-3">
            <el-radio label="侵权/抄袭" value="侵权/抄袭" border class="!ml-0 w-full !h-auto py-3 !rounded-xl">侵权/抄袭 (需上传凭证加速处理)</el-radio>
            <el-radio label="色情低俗" value="色情低俗" border class="!ml-0 w-full !h-auto py-3 !rounded-xl">色情低俗</el-radio>
            <el-radio label="垃圾广告" value="垃圾广告" border class="!ml-0 w-full !h-auto py-3 !rounded-xl">垃圾广告/中介代理</el-radio>
            <el-radio label="虚假信息" value="虚假信息" border class="!ml-0 w-full !h-auto py-3 !rounded-xl">虚假信息/欺诈</el-radio>
            <el-radio label="其他" value="其他" border class="!ml-0 w-full !h-auto py-3 !rounded-xl">其他</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="补充说明 (选填)">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请提供更多细节，以便我们快速核查..."
            class="rounded-xl"
          />
        </el-form-item>

        <el-form-item label="证据截图 (选填)">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="3"
            multiple
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="text-[10px] text-gray-400 mt-2">
                侵权举报建议提供对比截图，最多 3 张
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <div class="mt-8 flex justify-end gap-3">
        <el-button @click="visible = false" class="rounded-xl px-6">取消</el-button>
        <el-button 
          type="primary" 
          class="rounded-xl px-10 font-bold" 
          :loading="submitting"
          @click="handleSubmit"
        >
          确认举报
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, markRaw } from 'vue'
import { Document, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  targetTitle: string
  targetId: string | number
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const visible = ref(props.modelValue)
const submitting = ref(false)
const reportedCache = ref<Set<string | number>>(new Set())

const form = reactive({
  type: '侵权/抄袭',
  description: '',
})

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const handleSubmit = () => {
  // BR41 check
  if (reportedCache.value.has(props.targetId)) {
    ElMessage.warning('您已举报过该文档，处理中，请勿重复操作')
    visible.value = false
    return
  }

  if (form.type === '侵权/抄袭' && !form.description && form.description.length < 5) {
    ElMessage.warning('侵权举报请在说明中提供侵权细节或外部链接')
    return
  }

  submitting.value = true
  // Mock API call
  setTimeout(() => {
    submitting.value = false
    ElMessage.success({
      message: '举报工单已生成 (ID: RP' + props.targetId + ')，管理员将尽快核查',
      duration: 3000
    })
    reportedCache.value.add(props.targetId)
    visible.value = false
    emit('success')
    // Reset form
    form.type = '侵权/抄袭'
    form.description = ''
  }, 1500)
}
</script>

<style scoped>
:deep(.el-radio.is-bordered.is-checked) {
  background-color: var(--el-color-primary-light-9);
}
:deep(.el-radio__label) {
  font-size: 13px;
}
</style>
