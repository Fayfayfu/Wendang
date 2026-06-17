<template>
  <div class="admin-layout min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-[#304156] text-[#bfcbd9] transition-all duration-300 flex flex-col shrink-0 overflow-hidden',
        isCollapsed ? 'w-16' : 'w-52'
      ]"
    >
      <!-- Logo Area -->
      <div class="h-12 flex items-center px-4 bg-[#2b2f3a] overflow-hidden whitespace-nowrap">
        <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center shrink-0">
          <span class="text-white text-[10px] font-bold italic">WD</span>
        </div>
        <span v-if="!isCollapsed" class="ml-3 text-white font-bold text-sm tracking-widest">稳当文档管理系统</span>
      </div>

      <!-- Menu -->
      <el-scrollbar class="flex-1">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
          class="admin-sidebar-menu border-none"
          unique-opened
          router
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><Odometer /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>

          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/documents">
            <el-icon><Document /></el-icon>
            <template #title>文档管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/collections">
            <el-icon><Files /></el-icon>
            <template #title>文集管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/tasks">
            <el-icon><Briefcase /></el-icon>
            <template #title>任务管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/reports">
            <el-icon><Warning /></el-icon>
            <template #title>举报管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/tickets">
            <el-icon><ChatDotSquare /></el-icon>
            <template #title>工单管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/credit">
            <el-icon><Medal /></el-icon>
            <template #title>信誉分管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/banners">
            <el-icon><Picture /></el-icon>
            <template #title>轮播图管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/payment-config">
            <el-icon><Money /></el-icon>
            <template #title>金额配置</template>
          </el-menu-item>

          <el-menu-item index="/admin/ai-config">
            <el-icon><MagicStick /></el-icon>
            <template #title>AI配置</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Navbar -->
      <header class="h-12 bg-white shadow-sm flex items-center justify-between px-4 z-10 shrink-0">
        <div class="flex items-center gap-4">
          <div 
            class="text-xl cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
            @click="isCollapsed = !isCollapsed"
          >
            <el-icon><Fold v-if="!isCollapsed" /><Expand v-else /></el-icon>
          </div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center gap-4">
          <el-dropdown trigger="click">
            <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
              <el-avatar 
                :size="28" 
                src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" 
              />
              <span class="text-sm font-medium text-gray-700">超级管理员</span>
              <el-icon class="text-gray-400"><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- App Main -->
      <main class="flex-1 p-6 overflow-auto bg-[#f0f2f5]">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Odometer, User, Document, Files, Briefcase, Warning, 
  ChatDotSquare, Medal, Picture, Money, MagicStick,
  Fold, Expand, CaretBottom
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isCollapsed = ref(false)

const activeMenu = computed(() => route.path)
const currentRouteName = computed(() => (route.meta.title as string) || '仪表盘')

const handleLogout = () => {
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.admin-sidebar-menu:not(.el-menu--collapse) {
  width: 208px;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.2s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

:deep(.el-menu-item.is-active) {
  background-color: #263445 !important;
}

:deep(.el-menu-item:hover) {
  background-color: #263445 !important;
}
</style>
