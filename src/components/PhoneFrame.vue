<template>
  <div class="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300 px-4">
    <!-- Close Overlay -->
    <div class="absolute inset-0" @click="router.push('/')"></div>

    <!-- Phone Container -->
    <div class="relative w-[375px] h-[812px] bg-black rounded-[55px] shadow-[0_0_0_4px_#333,0_0_20px_10px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 duration-300">
      
      <!-- Notch (Camera & Sensors) -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[34px] bg-black rounded-b-[20px] z-50 flex items-center justify-center">
        <div class="w-[40px] h-[6px] bg-[#111] rounded-full mr-4"></div>
        <div class="w-[8px] h-[8px] bg-[#111] rounded-full"></div>
      </div>

      <!-- Status Bar -->
      <div class="absolute top-0 left-0 w-full h-[44px] z-40 flex justify-between items-end px-8 pb-1.5 text-[12px] font-bold text-black pointer-events-none" :class="{'text-white': isDarkMode}">
        <span>{{ currentTime }}</span>
        <div class="flex items-center gap-1.5">
          <div class="flex gap-0.5">
            <div class="w-0.5 h-1.5 bg-current rounded-full"></div>
            <div class="w-0.5 h-2 bg-current rounded-full"></div>
            <div class="w-0.5 h-2.5 bg-current rounded-full"></div>
            <div class="w-0.5 h-3 bg-current rounded-full opacity-30"></div>
          </div>
          <span>5G</span>
          <div class="w-5 h-2.5 border border-current/30 rounded-sm relative px-[1px] py-[1px]">
             <div class="h-full bg-current rounded-[0.5px] w-[80%]"></div>
             <div class="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[3px] bg-current/30 rounded-r-full"></div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="w-full h-full bg-[#F5F5F5] rounded-[44px] overflow-hidden relative">
        <router-view v-slot="{ Component }">
          <transition 
            :name="transitionName"
            mode="out-in"
          >
            <component :is="Component" class="absolute inset-0 w-full h-full overflow-y-auto" />
          </transition>
        </router-view>
      </div>

      <!-- Home Indicator -->
      <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-black/20 rounded-full z-50 pointer-events-none"></div>

      <!-- Control Buttons -->
      <button 
        @click="router.push('/')"
        class="absolute -right-16 top-10 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 transition-all"
      >
        <el-icon :size="20"><Close /></el-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Close } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const currentTime = ref('')
const isDarkMode = computed(() => route.meta.mobileDarkMode || false)
const transitionName = ref('slide-left')

// Update Time
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
}

let timer: any
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => clearInterval(timer))

// Watch route for animations
watch(route, (to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  transitionName.value = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})
</script>

<style scoped>
/* Page Animations */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Hide Scrollbar but allow scrolling */
.overflow-y-auto {
  scrollbar-width: none;
}
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
</style>
