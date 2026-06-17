<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
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
          <h1 class="text-3xl font-black text-gray-900 tracking-tighter">稳当文档</h1>
          <p class="text-xs text-gray-400 font-mono tracking-[0.3em] mt-1 uppercase">wendang.com</p>
        </div>
      </div>
      <h2 class="mt-6 text-center text-xl font-bold text-gray-900 flex flex-col gap-1 items-center justify-center">
        <span>{{ loginMode === 'qr' ? '微信扫码安全登录' : '欢迎回来' }}</span>
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
        
        <!-- Toggle QR/Password -->
        <div class="absolute top-0 right-0 w-16 h-16 cursor-pointer group" @click="loginMode = loginMode === 'qr' ? 'password' : 'qr'">
          <div class="absolute top-0 right-0 w-0 h-0 border-t-[64px] border-l-[64px] border-t-blue-50 border-l-transparent group-hover:border-t-blue-100 transition-colors"></div>
          <el-icon class="absolute top-3 right-3 text-blue-600" :size="24">
            <component :is="loginMode === 'qr' ? User : Cellphone" />
          </el-icon>
        </div>

        <div v-if="loginMode === 'qr'" class="text-center py-8">
          <div class="relative inline-block p-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 mb-6">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=wendang_login_mock" class="w-[180px] h-[180px] opacity-90" />
            <div v-if="qrExpired" class="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
              <p class="text-sm font-bold text-gray-600 mb-4">二维码已失效</p>
              <el-button type="primary" size="small" @click="qrExpired = false">点击刷新</el-button>
            </div>
          </div>
          <p class="text-sm text-gray-500">请使用微信扫一扫登录</p>
          <p class="text-xs text-gray-300 mt-2">首次登录将自动创建账号</p>
        </div>

        <div v-else>
          <el-tabs v-model="activeTab" class="login-tabs mb-6">
            <el-tab-pane label="账号密码登录" name="password" />
            <el-tab-pane label="短信验证码登录" name="code" />
          </el-tabs>

          <el-form 
            ref="loginFormRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            size="large"
          >
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="formData.mobile" placeholder="请输入手机号">
                <template #prefix>
                  <el-icon><Cellphone /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item v-if="activeTab === 'password'" label="密码" prop="password">
              <el-input 
                v-model="formData.password" 
                type="password" 
                show-password 
                placeholder="请输入密码"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item v-else label="验证码" prop="code">
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

            <div class="flex items-center justify-between mb-8">
              <el-checkbox v-model="rememberMe" label="记住我" size="small" />
              <el-button link type="primary" size="small" @click="showForgot = true">忘记密码？</el-button>
            </div>

            <el-button 
              type="primary" 
              class="w-full h-12 text-md font-bold rounded-xl shadow-lg shadow-blue-200"
              :loading="loading"
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form>

          <div class="mt-8">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-100"></div>
              </div>
              <div class="relative flex justify-center text-xs">
                <span class="px-3 bg-white text-gray-400">其他登录方式</span>
              </div>
            </div>

            <div class="mt-6 flex justify-center gap-8">
              <el-tooltip content="微信登录">
                 <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 cursor-pointer hover:bg-green-100 transition-colors">
                   <el-icon :size="20"><ChatDotRound /></el-icon>
                 </div>
              </el-tooltip>
              <el-tooltip content="更多">
                 <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
                   <el-icon :size="20"><MoreFilled /></el-icon>
                 </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-8 text-center text-sm text-gray-500">
        还没有账号？
        <router-link to="/register" class="font-bold text-blue-600 hover:text-blue-500">
          立即注册
        </router-link>
      </p>
    </div>

    <!-- 忘记密码弹窗 -->
    <el-dialog v-model="showForgot" title="找回密码" width="400">
      <el-form label-position="top">
        <el-form-item label="手机号">
          <el-input v-model="forgotData.mobile" placeholder="注册手机号" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="flex gap-4">
            <el-input v-model="forgotData.code" placeholder="验证码" />
            <el-button>获取</el-button>
          </div>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="forgotData.newPassword" type="password" show-password placeholder="设置新密码" />
        </el-form-item>
        <div class="mt-6">
          <el-button type="primary" class="w-full" @click="handleReset">重置并登录</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store'
import { 
  Cellphone, Lock, Message, User, 
  ChatDotRound, MoreFilled 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const userStore = useMainStore()

const loginMode = ref<'password' | 'qr'>('password')
const activeTab = ref('password')
const loading = ref(false)
const rememberMe = ref(true)

const loginFormRef = ref<FormInstance>()
const formData = reactive({
  mobile: '',
  password: '',
  code: ''
})

const rules = reactive<FormRules>({
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '长度应为6位', trigger: 'blur' }
  ]
})

const countdown = ref(60)
const timer = ref<any>(null)
const sendCode = () => {
  if (!/^1[3-9]\d{9}$/.test(formData.mobile)) {
    return ElMessage.warning('请先输入正确的手机号')
  }
  ElMessage.success('验证码已发送')
  countdown.value = 60
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      timer.value = null
    }
  }, 1000)
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟登录
      setTimeout(() => {
        userStore.setUser({
          id: 'u1',
          nickname: '极客张',
          avatar: 'https://ui-avatars.com/api/?name=Z&background=random',
          isVip: true,
          balance: 4280
        })
        ElMessage.success('登录成功')
        router.push('/')
      }, 1000)
    }
  })
}

const qrExpired = ref(false)
// Mock QR expiry
setTimeout(() => qrExpired.value = true, 60000)

const showForgot = ref(false)
const forgotData = reactive({
  mobile: '',
  code: '',
  newPassword: ''
})
const handleReset = () => {
  ElMessage.success('密码已重置，已为您自动登录')
  userStore.setUser({
    id: 'u1',
    nickname: '极客张',
    avatar: 'https://ui-avatars.com/api/?name=Z&background=random',
    isVip: true,
    balance: 4280
  })
  router.push('/')
}
</script>

<style scoped>
:deep(.login-tabs .el-tabs__header) {
  margin-bottom: 24px;
  border: none;
}
:deep(.login-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.login-tabs .el-tabs__item) {
  font-weight: bold;
  font-size: 15px;
}
</style>
