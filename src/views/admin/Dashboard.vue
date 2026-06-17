<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <el-icon :size="24"><User /></el-icon>
          </div>
          <div>
            <p class="text-[10px] text-gray-500 font-medium">今日新增用户</p>
            <div class="flex items-baseline gap-2">
              <p class="text-2xl font-black text-gray-900">12</p>
              <span class="text-[10px] text-green-500 font-bold">+8% ↑</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <el-icon :size="24"><Document /></el-icon>
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">今日新增文档</p>
            <div class="flex items-baseline gap-2">
              <p class="text-2xl font-black text-gray-900">45</p>
              <span class="text-[10px] text-green-500 font-bold">+12% ↑</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <el-icon :size="24"><Money /></el-icon>
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">总收入 (本月)</p>
            <div class="flex items-baseline gap-2">
              <p class="text-2xl font-black text-gray-900">¥12,840</p>
              <span class="text-[10px] text-red-400 font-bold">-2.4% ↓</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
          <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <el-icon :size="24"><Briefcase /></el-icon>
          </div>
          <div>
            <p class="text-xs text-gray-500 font-medium">任务完成数</p>
            <div class="flex items-baseline gap-2">
              <p class="text-2xl font-black text-gray-900">{{ mockTasks.filter(t => t.status === TaskStatus.COMPLETED).length }}</p>
              <span class="text-[10px] text-green-500 font-bold">+5% ↑</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <span class="w-1 h-4 bg-blue-600 rounded-full"></span>
            实时动态
          </h3>
          <el-button link type="primary">更多</el-button>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in recentActivities"
            :key="index"
            :type="activity.type"
            :timestamp="activity.time"
          >
            <span class="text-sm font-medium text-gray-700">{{ activity.user }}</span>
            <span class="text-sm text-gray-500 ml-2">{{ activity.content }}</span>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-6">
          <span class="w-1 h-4 bg-orange-600 rounded-full"></span>
          便捷导航
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <router-link 
            v-for="nav in quickNavs" 
            :key="nav.name"
            :to="nav.path"
            class="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-50 hover:border-blue-200 hover:bg-blue-50 transition-all group"
          >
            <el-icon :size="24" class="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors">
              <component :is="nav.icon" />
            </el-icon>
            <span class="text-xs font-medium text-gray-600 group-hover:text-blue-600 transition-colors">{{ nav.name }}</span>
          </router-link>
        </div>
        
        <div class="mt-8 p-4 bg-blue-600 rounded-xl text-white relative overflow-hidden group">
          <div class="relative z-10">
            <h4 class="font-bold text-sm mb-1">系统升级提醒</h4>
            <p class="text-[10px] opacity-80 leading-relaxed">
              V2.4.0 版本已部署，新增 AI 文档解析引擎，请及时核查 AI 配置。
            </p>
          </div>
          <el-icon class="absolute -right-4 -bottom-4 text-white/10" :size="80"><MagicStick /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { mockDocuments, mockUsers, mockTasks } from '@/mock'
import { TaskStatus } from '@/types'
import { 
  Document, User, Money, Briefcase, MagicStick,
  Files, Warning, ChatDotSquare, Picture
} from '@element-plus/icons-vue'

const recentActivities = ref([
  { user: '技术宅小明', content: '上传了新文档《2026年后端开发面试手册》', time: '10:24', type: 'primary' },
  { user: '考研路漫漫', content: '提交了任务《考研复试真题》的交付物', time: '09:15', type: 'success' },
  { user: '系统日志', content: '拦截到一次异常 IP 登录尝试 (192.168.1.10)', time: '08:42', type: 'danger' },
  { user: '新用户_4182', content: '完成手机号注册', time: '08:10', type: 'info' }
])

const quickNavs = [
  { name: '文档审核', path: '/admin/documents', icon: markRaw(Document) },
  { name: '举报处理', path: '/admin/reports', icon: markRaw(Warning) },
  { name: '用户管理', path: '/admin/users', icon: markRaw(User) },
  { name: '任务管理', path: '/admin/tasks', icon: markRaw(Briefcase) },
  { name: '轮播配置', path: '/admin/banners', icon: markRaw(Picture) },
  { name: '文集管理', path: '/admin/collections', icon: markRaw(Files) }
]
</script>
