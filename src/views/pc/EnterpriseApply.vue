<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { 
  ArrowLeft, Plus, Delete, Check, Lock, Warning, InfoFilled, 
  OfficeBuilding, Message, Iphone, CreditCard, Postcard, Stamp,
  Avatar, Document, Briefcase
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const currentStep = ref(1)
const loading = ref(false)

const form = reactive({
  // Step 1: Enterprise
  entType: '',
  entName: '',
  licenseNumber: '',
  entAddress: '',
  website: '',
  intro: '',
  logo: '',
  licensePhoto: '',
  contactPhone: '',
  
  // Step 2: Legal Person
  idType: '身份证',
  realName: '',
  idNumber: '',
  residence: '',
  idValidity: [] as string[],
  idFront: '',
  idBack: '',
  legalPhone: '',
  verifyCode: '',
  email: '',

  agreed: false
})

const entTypes = [
  { label: '有限责任公司', value: 'llc' },
  { label: '股份有限公司', value: 'corp' },
  { label: '个体工商户', value: 'individual' },
  { label: '事业单位/社会团体', value: 'org' }
]

const handleBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.back()
  }
}

const handleNext = () => {
  if (currentStep.value === 1) {
    if (!form.entName || !form.licenseNumber) return ElMessage.warning('请填写企业全称与营业执照号')
  }
  if (currentStep.value < 2) {
    currentStep.value++
  }
}

const handleSubmit = async () => {
  if (!form.agreed) return ElMessage.warning('请先同意服务协议')
  
  loading.value = true
  // Mock submission
  setTimeout(() => {
    loading.value = false
    ElMessage.success('企业认证申请已提交，审核约需 1-3 个工作日')
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
        <h1 class="text-2xl font-black text-gray-900 tracking-tighter">企业认证申请</h1>
      </div>

      <!-- Step Indicator -->
      <div class="mb-16">
        <el-steps :active="currentStep" simple class="!bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <el-step title="企业主体信息" :icon="OfficeBuilding" />
          <el-step title="法人代表核实" :icon="Avatar" />
        </el-steps>
      </div>

      <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/30 overflow-hidden">
        <div class="p-12">
          
          <!-- Step 1: Enterprise Details -->
          <div v-show="currentStep === 1">
            <h3 class="text-xl font-black text-gray-900 mb-10 flex items-center gap-3 pb-6 border-b border-gray-50">
               <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                 <el-icon :size="20"><OfficeBuilding /></el-icon>
               </div>
               <span>企业基本信息</span>
            </h3>

            <el-form label-position="top">
               <el-row :gutter="40">
                 <el-col :span="8">
                    <el-form-item label="企业认证类型" required>
                      <el-select v-model="form.entType" placeholder="选择架构" class="!w-full">
                        <el-option v-for="t in entTypes" :key="t.value" :label="t.label" :value="t.value" />
                      </el-select>
                    </el-form-item>
                 </el-col>
                 <el-col :span="8">
                    <el-form-item label="企业全称 (需与执照一致)" required>
                      <el-input v-model="form.entName" placeholder="企业完整名称" />
                    </el-form-item>
                 </el-col>
                 <el-col :span="8">
                    <el-form-item label="营业执照注册号" required>
                      <el-input v-model="form.licenseNumber" placeholder="社会统一代码" />
                    </el-form-item>
                 </el-col>
                 <el-col :span="8">
                    <el-form-item label="注册地址" required>
                      <el-input v-model="form.entAddress" placeholder="工商注册地址" />
                    </el-form-item>
                 </el-col>
                 <el-col :span="8">
                    <el-form-item label="官方网站">
                      <el-input v-model="form.website" placeholder="https://..." />
                    </el-form-item>
                 </el-col>
                 <el-col :span="8">
                    <el-form-item label="联系手机" required>
                      <el-input v-model="form.contactPhone" placeholder="联系人手机号" />
                    </el-form-item>
                 </el-col>
               </el-row>

               <el-form-item label="企业简介" class="mt-4">
                 <el-input v-model="form.intro" type="textarea" :rows="4" placeholder="简述企业主营业务、行业地位等信息..." />
               </el-form-item>

               <div class="grid grid-cols-2 gap-8 mt-10">
                 <el-form-item label="企业徽标 (Logo)" required>
                    <div class="w-32 h-32 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-2 bg-gray-50/50 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer group">
                      <el-icon :size="24" class="text-gray-300 group-hover:text-blue-500"><Plus /></el-icon>
                      <span class="text-[10px] text-gray-400">上传Logo</span>
                    </div>
                 </el-form-item>

                 <el-form-item label="营业执照照片 (需加盖公章)" required>
                    <div class="aspect-[1.4/1] w-80 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-3 bg-gray-50/50 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer group">
                      <el-icon :size="32" class="text-gray-300 group-hover:text-blue-500"><Plus /></el-icon>
                      <span class="text-xs text-gray-400 text-center px-4">上传清晰营业执照照片<br/>(需加盖红色企业公章)</span>
                    </div>
                    <div class="mt-3 text-[10px] text-gray-400 flex items-center gap-1">
                       <el-icon><InfoFilled /></el-icon>
                       支持 JPG/PNG 格式，大小不超过 10MB
                    </div>
                 </el-form-item>
               </div>
            </el-form>
          </div>

          <!-- Step 2: Legal Person -->
          <div v-show="currentStep === 2">
            <h3 class="text-xl font-black text-gray-900 mb-10 flex items-center gap-3 pb-6 border-b border-gray-50">
               <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                 <el-icon :size="20"><Avatar /></el-icon>
               </div>
               <span>法人信息核实</span>
            </h3>

            <el-form label-position="top">
              <el-row :gutter="40">
                <el-col :span="8">
                  <el-form-item label="证件类型" required>
                    <el-select v-model="form.idType" class="!w-full">
                      <el-option label="身份证" value="身份证" />
                      <el-option label="护照" value="护照" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="法人姓名" required>
                    <el-input v-model="form.realName" placeholder="请填写法人姓名" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码" required>
                    <el-input v-model="form.idNumber" placeholder="18位身份证号" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                   <el-form-item label="证件居住地址" required>
                     <el-input v-model="form.residence" placeholder="需与证件背面核对一致" />
                   </el-form-item>
                </el-col>
              </el-row>

               <div class="mt-8 mb-12">
                <el-form-item label="法人证件照片上传" required>
                   <div class="flex gap-10">
                     <div class="flex-1 max-w-[360px]">
                        <div class="aspect-[1.6/1] border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:border-blue-200 transition-all cursor-pointer group">
                           <el-icon :size="40" class="text-gray-300 group-hover:text-blue-500"><Plus /></el-icon>
                           <span class="text-xs text-gray-400">人像面照片</span>
                        </div>
                     </div>
                     <div class="flex-1 max-w-[360px]">
                        <div class="aspect-[1.6/1] border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:border-blue-200 transition-all cursor-pointer group">
                           <el-icon :size="40" class="text-gray-300 group-hover:text-blue-500"><Plus /></el-icon>
                           <span class="text-xs text-gray-400">国徽面照片</span>
                        </div>
                     </div>
                   </div>
                   <div class="mt-3 text-[10px] text-gray-400 flex items-center gap-1">
                      <el-icon><InfoFilled /></el-icon>
                      照片要求格式为JPG/JPEG/GIF/PNG，大小不要超过 5MB
                   </div>
                   <div class="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                      <el-icon><Lock /></el-icon>
                      我们将严格对您的隐私数据加密存储，仅用于身份核实
                   </div>
                </el-form-item>
              </div>

              <div class="p-10 bg-gray-50/50 border border-gray-100 rounded-3xl mb-12">
                <h4 class="text-base font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <el-icon class="text-blue-600"><Message /></el-icon>
                  核心联系方式
                </h4>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <el-form-item label="法人/负责人手机" required>
                      <div class="flex gap-2">
                         <el-input v-model="form.legalPhone" placeholder="持证人常用手机" class="flex-1">
                           <template #prefix><el-icon><Iphone /></el-icon></template>
                         </el-input>
                         <el-button class="!rounded-xl px-4 !h-12">获取验证码</el-button>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="对公联系邮箱" required>
                      <el-input v-model="form.email" placeholder="example@enterprise.com">
                        <template #prefix><el-icon><Message /></el-icon></template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <div class="flex flex-col items-center gap-4">
                <el-checkbox v-model="form.agreed">
                  <span class="text-xs text-gray-500">
                    本公司承诺以上信息真实合法，并接受 <a href="#" class="text-blue-600 font-bold hover:underline">《企业认证服务协议》</a>
                  </span>
                </el-checkbox>
              </div>
            </el-form>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-12 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <div class="text-[10px] text-gray-400">
            <el-icon class="mr-1"><Lock /></el-icon>
            稳当文档采用行业领先的端到端加密技术，确保所有企业敏感信息不被泄露。
          </div>
          <div class="flex gap-4">
            <el-button v-if="currentStep > 1" @click="currentStep--" class="!h-14 !px-8 !rounded-2xl !font-bold">
              上一步
            </el-button>
            <el-button 
              v-if="currentStep < 2" 
              type="primary" 
              class="!h-14 !px-12 !rounded-2xl !font-bold shadow-xl shadow-emerald-100 !bg-slate-900 !border-none"
              @click="handleNext"
            >
              下一步
            </el-button>
            <el-button 
              v-else 
              type="primary" 
              class="!h-14 !px-12 !rounded-2xl !font-bold shadow-xl shadow-blue-100 !bg-blue-600 !border-none"
              :loading="loading"
              @click="handleSubmit"
            >
              提交企业认证
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
  border-radius: 14px;
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
  border-color: #2563EB !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
}
</style>
