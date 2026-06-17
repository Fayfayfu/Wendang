<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="flex justify-center flex-col items-center cursor-pointer group" @click="router.push('/')">
        <div class="relative w-16 h-16 flex items-center justify-center mb-4">
          <div class="absolute inset-0 bg-blue-100 rounded-xl rotate-3 group-hover:rotate-6 transition-transform"></div>
          <div class="absolute inset-0 bg-blue-200 rounded-xl -rotate-2 group-hover:-rotate-4 transition-transform"></div>
          <div class="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-xl flex items-center justify-center overflow-hidden">
             <div class="absolute top-0 right-0 w-6 h-6 bg-white/20 rounded-bl-xl"></div>
             <div class="flex flex-col gap-2 px-4 w-full">
               <div class="h-1.5 bg-white/40 rounded-full w-3/4"></div>
               <div class="h-1.5 bg-white/60 rounded-full w-full"></div>
               <div class="h-1.5 bg-white/40 rounded-full w-1/2"></div>
             </div>
          </div>
        </div>
        <div class="text-center leading-none">
          <h1 class="text-3xl font-black text-gray-900 tracking-tighter">加入稳当文档</h1>
          <p class="text-xs text-gray-400 font-mono tracking-[0.3em] mt-1 uppercase">wendang.com</p>
        </div>
      </div>
      <p class="mt-4 text-sm text-gray-600">
        开启您的知识共享之旅，发现更多精品资料
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-10 px-6 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
        <el-form 
          ref="registerFormRef"
          :model="formData"
          :rules="rules"
          label-position="top"
          size="large"
        >
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="formData.mobile" placeholder="您的手机号码">
              <template #prefix>
                <el-icon><Cellphone /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="code">
            <div class="flex gap-4 w-full">
              <el-input v-model="formData.code" placeholder="6位验证码" class="flex-1">
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
              <el-button 
                :disabled="!!timer" 
                class="w-32"
                @click="sendCode"
              >
                {{ timer ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="设置密码" prop="password">
            <el-input 
              v-model="formData.password" 
              type="password" 
              show-password 
              placeholder="请输入密码 (不少于6位)"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="formData.confirmPassword" 
              type="password" 
              show-password 
              placeholder="请再次输入密码"
            >
              <template #prefix>
                <el-icon><Check /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div class="mb-8">
            <el-checkbox v-model="agree" class="agreement-checkbox">
              <span class="text-xs text-gray-500">
                我已阅读并同意 
                <a href="#" class="text-blue-600 font-medium">《用户服务协议》</a> 
                和 
                <a href="#" class="text-blue-600 font-medium">《隐私权政策》</a>
              </span>
            </el-checkbox>
          </div>

          <el-button 
            type="primary" 
            class="w-full h-12 text-md font-bold rounded-xl shadow-lg shadow-blue-200"
            :loading="loading"
            @click="handleRegister"
          >
            注 册
          </el-button>
        </el-form>

        <div class="mt-8 pt-8 border-t border-gray-100 text-center">
          <p class="text-sm text-gray-400">
            已有账号？
            <router-link to="/login" class="font-bold text-blue-600 hover:text-blue-500">
              去登录
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store'
import { 
  Cellphone, Lock, Message, Check
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const userStore = useMainStore()

const loading = ref(false)
const agree = ref(false)

const registerFormRef = ref<FormInstance>()
const formData = reactive({
  mobile: '',
  password: '',
  confirmPassword: '',
  code: ''
})

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formData.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePass2, trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '长度应为6位', trigger: 'blur' }
  ]
})

const countdown = ref(60)
const timer = ref<any>(null)

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})

const sendCode = () => {
  if (!/^1[3-9]\d{9}$/.test(formData.mobile)) {
    return ElMessage.warning('请先输入正确的手机号')
  }
  ElMessage.success('验证码已发送至您的手机')
  countdown.value = 60
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      timer.value = null
    }
  }, 1000)
}

const handleRegister = async () => {
  if (!agree.value) {
    return ElMessage.warning('请先同意用户协议和隐私权政策')
  }
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟注册
      setTimeout(() => {
        userStore.setUser({
          id: 'u1',
          nickname: '新用户_' + formData.mobile.slice(-4),
          avatar: 'https://ui-avatars.com/api/?name=N&background=random',
          isVip: false,
          balance: 100 // 初始余额
        })
        ElMessage.success('注册成功，欢迎加入稳当文档')
        router.push('/')
      }, 1500)
    }
  })
}
</script>

<style scoped>
.agreement-checkbox {
  height: auto;
  white-space: normal;
}
:deep(.agreement-checkbox .el-checkbox__label) {
  display: inline;
}
</style>
