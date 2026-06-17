<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { 
  ArrowLeft, Plus, Delete, Check, Lock, Warning, InfoFilled, 
  User, Message, Iphone, CreditCard, Postcard, Stamp
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const currentStep = ref(1)
const loading = ref(false)

const form = reactive({
  type: '',
  isPublic: true,
  realName: '',
  idType: '身份证',
  idNumber: '',
  idPhotos: [] as any[],
  idValidity: [] as string[],
  certificates: [
    { title: '', desc: '', photo: '' }
  ],
  title: '',
  company: '',
  field: '',
  bio: '',
  email: '',
  phone: '',
  verifyCode: '',
  bankUser: '',
  bankCard: '',
  bankName: '',
  bankAddress: '',
  agreed: false
})

const certTypes = [
  { label: '教育科研', value: 'edu', children: ['大学教授', '研究员', '人民教师'] },
  { label: '互联网/IT', value: 'it', children: ['软件工程师', '产品经理', 'UI设计师'] },
  { label: '法律合规', value: 'law', children: ['执业律师', '法务顾问'] },
  { label: '金融/销售', value: 'finance', children: ['投资顾问', '理财师', '高级销售'] }
]

const addCertificate = () => {
  form.certificates.push({ title: '', desc: '', photo: '' })
}

const removeCertificate = (index: number) => {
  form.certificates.splice(index, 1)
}

const handleBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.back()
  }
}

const handleNext = () => {
  if (currentStep.value === 1) {
    if (!form.type) return ElMessage.warning('请选择认证类型')
    if (!form.realName || !form.idNumber) return ElMessage.warning('请完善真实姓名与证件号')
  }
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const handleSubmit = async () => {
  if (!form.agreed) return ElMessage.warning('请先同意认证协议')
  
  loading.value = true
  // Mock submission
  setTimeout(() => {
    loading.value = false
    ElMessage.success('申请提交成功，请耐心等待审核')
    router.push('/profile')
  }, 2000)
}
</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto py-12 px-4">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-12">
        <el-button link @click="handleBack" class="!text-gray-400 hover:!text-gray-900 group">
          <el-icon :size="20" class="group-hover:-translate-x-1 transition-transform"><ArrowLeft /></el-icon>
          <span class="ml-1 font-bold">返回</span>
        </el-button>
        <div class="h-8 w-[1px] bg-gray-200 mx-2"></div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">申请个人认证</h1>
      </div>

      <!-- Step Indicator -->
      <div class="mb-16">
        <el-steps :active="currentStep" simple class="!bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <el-step title="基本资料" />
          <el-step title="专业信息" />
          <el-step title="结算与协议" />
        </el-steps>
      </div>

      <!-- Form Container -->
      <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
        <div class="p-12">
          
          <!-- Step 1: Basic Info & ID -->
          <div v-show="currentStep === 1">
            <div class="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50">
              <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <el-icon :size="20"><User /></el-icon>
              </div>
              <div>
                <h3 class="text-lg font-black text-gray-900">基本信息</h3>
                <p class="text-[10px] text-gray-400">请确保姓名与证件号一致，以确保审核通过率</p>
              </div>
            </div>

            <el-form label-position="top">
              <el-row :gutter="40">
                <el-col :span="12">
                  <el-form-item label="认证类型" required>
                    <el-select v-model="form.type" placeholder="请选择您的专业领域" class="!w-full custom-select">
                      <el-option-group v-for="group in certTypes" :key="group.label" :label="group.label">
                        <el-option v-for="tag in group.children" :key="tag" :label="tag" :value="tag" />
                      </el-option-group>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="是否公开展示认证信息">
                    <div class="flex items-center gap-4 h-10">
                      <el-radio-group v-model="form.isPublic" size="large">
                        <el-radio :label="true">公开</el-radio>
                        <el-radio :label="false">隐藏</el-radio>
                      </el-radio-group>
                      <el-tooltip content="选择“是”后，在您的头像和文档列表旁将显示认证标识" placement="top">
                        <el-icon class="text-gray-300 ml-2"><InfoFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="mt-8 mb-10 pb-10 border-b border-gray-50">
                <h3 class="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <el-icon :size="20" class="text-indigo-600"><Postcard /></el-icon>
                  身份实名认证
                </h3>
                <el-row :gutter="40">
                  <el-col :span="8">
                    <el-form-item label="真实姓名" required>
                      <el-input v-model="form.realName" placeholder="请填写真实姓名" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证件类型" required>
                      <el-select v-model="form.idType" class="!w-full">
                        <el-option label="身份证" value="身份证" />
                        <el-option label="护照" value="护照" />
                        <el-option label="港澳台通行证" value="其他" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证件号码" required>
                      <el-input v-model="form.idNumber" placeholder="请输入证件号码" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item label="证件照片上传 (个人隐私严格加密保护)" required class="mt-4">
                  <div class="flex gap-6">
                    <div class="flex-1 max-w-[320px]">
                      <div class="aspect-[1.6/1] border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer group">
                        <el-icon :size="40" class="text-gray-300 group-hover:text-indigo-500"><Plus /></el-icon>
                        <span class="text-xs text-gray-400 group-hover:text-indigo-600">上传人像面照片</span>
                      </div>
                    </div>
                    <div class="flex-1 max-w-[320px]">
                      <div class="aspect-[1.6/1] border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer group">
                        <el-icon :size="40" class="text-gray-300 group-hover:text-indigo-500"><Plus /></el-icon>
                        <span class="text-xs text-gray-400 group-hover:text-indigo-600">上传国徽面照片</span>
                      </div>
                    </div>
                  </div>
                    <div class="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                      <el-icon><InfoFilled /></el-icon>
                      照片要求格式为JPG/JPEG/GIF/PNG，大小不要超过 5MB
                    </div>
                    <div class="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                      <el-icon><Lock /></el-icon>
                      我们将严格对您的隐私数据加密存储，仅用于身份核实
                    </div>
                </el-form-item>
              </div>
            </el-form>
          </div>

          <!-- Step 2: Professional Details -->
          <div v-show="currentStep === 2">
            <div class="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50">
              <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <el-icon :size="20"><Stamp /></el-icon>
              </div>
              <div>
                <h3 class="text-lg font-black text-gray-900">专业证明</h3>
                <p class="text-[10px] text-gray-400">上传证书、获奖证明或其他能体现您专业价值的材料</p>
              </div>
            </div>

            <el-form label-position="top">
              <div v-for="(cert, index) in form.certificates" :key="index" class="p-8 border border-gray-100 rounded-3xl bg-gray-50/30 mb-8 relative group">
                <el-button 
                  v-if="form.certificates.length > 1" 
                  circle 
                  type="danger" 
                  :icon="Delete" 
                  class="absolute -top-3 -right-3 !shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="removeCertificate(index)"
                />
                
                <el-row :gutter="40">
                  <el-col :span="16">
                    <el-form-item :label="`证书 ${index + 1} 名称`" required>
                      <el-input v-model="cert.title" placeholder="例如：高级中学教师资格证" />
                    </el-form-item>
                    <el-form-item label="说明补充" class="mb-0">
                      <el-input v-model="cert.desc" type="textarea" :rows="3" placeholder="简要描述证书详情或颁发机构..." />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="证书附件" required>
                      <div class="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 bg-white hover:border-emerald-300 transition-colors cursor-pointer group">
                         <el-icon :size="24" class="text-gray-300 group-hover:text-emerald-500"><Plus /></el-icon>
                         <span class="text-[10px] text-gray-400">点击上传照片</span>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <el-button 
                dashed 
                class="!w-full !h-16 !border-dashed !rounded-2xl !text-gray-400 hover:!text-indigo-600 hover:!border-indigo-200 hover:!bg-indigo-50 transition-all mb-12"
                @click="addCertificate"
              >
                <el-icon class="mr-2"><Plus /></el-icon>
                添加更多证明材料
              </el-button>

              <h3 class="text-lg font-black text-gray-900 mb-8 mt-12">专业展示信息</h3>
              <el-row :gutter="40">
                <el-col :span="12">
                  <el-form-item label="行业头衔">
                    <el-input v-model="form.title" placeholder="如：PHP高级架构师" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工作单位/机构">
                    <el-input v-model="form.company" placeholder="当前任职的机构名称" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="个人简介">
                <el-input v-model="form.bio" type="textarea" :rows="4" placeholder="一句话向大家介绍您的专业实力..." />
              </el-form-item>
            </el-form>
          </div>

          <!-- Step 3: Contact & Bank Info -->
          <div v-show="currentStep === 3">
            <div class="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50">
              <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <el-icon :size="20"><Message /></el-icon>
              </div>
              <div>
                <h3 class="text-lg font-black text-gray-900">联系与结算</h3>
                <p class="text-[10px] text-gray-400">完善收款信息，确保收益及时入账</p>
              </div>
            </div>

            <el-form label-position="top">
              <el-row :gutter="40">
                <el-col :span="12">
                  <el-form-item label="联系邮箱" required>
                    <el-input v-model="form.email" placeholder="example@email.com">
                      <template #prefix><el-icon><Message /></el-icon></template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系手机" required>
                    <div class="flex gap-2">
                       <el-input v-model="form.phone" placeholder="11位手机号" class="flex-1">
                         <template #prefix><el-icon><Iphone /></el-icon></template>
                       </el-input>
                       <el-button class="rounded-xl px-4 !h-12">获取验证码</el-button>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="p-10 bg-gray-50 rounded-[2rem] mt-8 mb-12 border border-gray-100">
                <h4 class="text-base font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <el-icon class="text-indigo-600" :size="22"><CreditCard /></el-icon>
                  结算信息 (用于提现收益)
                </h4>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <el-form-item label="持卡人姓名">
                      <el-input v-model="form.bankUser" placeholder="需与实名信息一致" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="银行卡号">
                      <el-input v-model="form.bankCard" placeholder="输入卡号" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="开户银行">
                      <el-select v-model="form.bankName" class="!w-full" placeholder="请选择银行">
                        <el-option label="中国工商银行" value="ICBC" />
                        <el-option label="中国建设银行" value="CCB" />
                        <el-option label="招商银行" value="CMB" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="开户支行">
                      <el-input v-model="form.bankAddress" placeholder="XX分行XX支行" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <div class="flex flex-col items-center gap-4">
                <el-checkbox v-model="form.agreed">
                  <span class="text-xs text-gray-500">
                    我已阅读并接受 <a href="#" class="text-indigo-600 font-bold hover:underline">《认证服务协议》</a> 和 <a href="#" class="text-indigo-600 font-bold hover:underline">《隐私保护政策》</a>
                  </span>
                </el-checkbox>
              </div>
            </el-form>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-12 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <div class="text-[10px] text-gray-400">
            <el-icon class="mr-1"><Warning /></el-icon>
            提交成功后，审核专员将在 24 小时内完成初审
          </div>
          <div class="flex gap-4">
            <el-button v-if="currentStep > 1" @click="currentStep--" class="!h-14 !px-8 !rounded-2xl !font-bold">
              上一步
            </el-button>
            <el-button 
              v-if="currentStep < 3" 
              type="primary" 
              class="!h-14 !px-12 !rounded-2xl !font-bold shadow-xl shadow-emerald-100"
              @click="handleNext"
            >
              下一步
            </el-button>
            <el-button 
              v-else 
              type="primary" 
              class="!h-14 !px-12 !rounded-2xl !font-bold shadow-xl shadow-indigo-100 !bg-indigo-600 !border-none"
              :loading="loading"
              @click="handleSubmit"
            >
              提交申请
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
:deep(.el-step.is-simple .el-step__title) {
  font-weight: 800;
  font-size: 14px;
}
:deep(.el-form-item__label) {
  font-weight: 700;
  color: #374151;
  font-size: 13px;
  padding-bottom: 8px;
}
:deep(.el-input__wrapper), :deep(.el-textarea__wrapper), :deep(.el-select__wrapper) {
  background-color: #F9FAFB;
  box-shadow: none !important;
  border: 1px solid #F3F4F6 !important;
  border-radius: 12px;
  padding: 0 16px;
  height: 48px;
  transition: all 0.3s;
}
:deep(.el-textarea__wrapper) {
  height: auto;
  padding: 12px 16px;
}
:deep(.el-input__wrapper.is-focus), :deep(.el-select__wrapper.is-focus) {
  background-color: white;
  border-color: #4F46E5 !important;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}
</style>
