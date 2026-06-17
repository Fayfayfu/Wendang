<template>
  <AppLayout>
    <section class="mb-8 overflow-hidden">
      <el-carousel 
        :interval="5000" 
        type="card" 
        arrow="always" 
        height="260px"
        class="home-carousel"
      >
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="relative w-full h-full group cursor-pointer overflow-hidden rounded-2xl shadow-xl border border-white/10">
            <img 
              :src="banner.image" 
              :alt="banner.title" 
              class="w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-110" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <div class="animate-fade-in-up">
                <h2 class="text-3xl font-black mb-2 tracking-tighter">{{ banner.title }}</h2>
                <p class="text-xs text-white/70 max-w-md leading-relaxed line-clamp-2">{{ banner.subtitle }}</p>
                <div class="mt-4 flex gap-3">
                  <el-button type="primary" class="!rounded-lg px-6 font-bold btn-gradient-animate border-none">立即探索</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 2. Category Blocks -->
    <section class="mb-12">
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4">
        <div 
          v-for="cat in catNav" 
          :key="cat.name"
          class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-blue-50 transition-colors group"
          @click="handleCatClick(cat)"
        >
          <div :class="`w-12 h-12 rounded-lg flex items-center justify-center text-white ${cat.color} group-hover:scale-110 transition-transform shadow-sm`">
            <el-icon :size="24"><component :is="cat.icon" /></el-icon>
          </div>
          <span class="text-xs font-bold text-gray-700">{{ cat.name }}</span>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Area: Recommendations & Collections -->
      <div class="lg:col-span-3 space-y-12">
        
        <!-- 3. Popular Recommendations -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold flex items-center gap-2">
              <el-icon class="text-red-500"><Histogram /></el-icon>
              热门推荐
            </h3>
            <el-button link>更多推荐 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" v-for="doc in documents.slice(0, 8)" :key="doc.id" class="mb-6">
              <div class="doc-card group overflow-hidden border border-gray-100 cursor-pointer" @click="router.push(`/document/${doc.id}`)">
                <div class="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img :src="doc.cover" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div v-if="doc.price > 0" class="absolute bottom-2 right-2 z-10 px-2 py-0.5 bg-orange-500 text-white text-[10px] rounded font-bold">
                    ¥{{ doc.price }}
                  </div>
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <el-button type="primary" circle><el-icon><View /></el-icon></el-button>
                    <el-button type="success" circle><el-icon><Download /></el-icon></el-button>
                  </div>
                </div>
                <div class="p-3">
                  <h4 class="text-sm font-bold line-clamp-2 h-10 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {{ doc.title }}
                  </h4>
                  <div class="flex items-center justify-between text-[10px] text-gray-400">
                    <div class="flex items-center gap-2">
                      <span class="flex items-center gap-0.5 font-medium"><el-icon><StarFilled /></el-icon>{{ doc.rating }}</span>
                      <span>{{ doc.pages }}页</span>
                    </div>
                    <span>{{ doc.downloadCount }}次下载</span>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </section>

        <!-- 5. Selected Collections -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold flex items-center gap-2">
              <el-icon class="text-purple-600"><CollectionTag /></el-icon>
              精选文集
            </h3>
          </div>
          <div class="overflow-x-auto pb-4 no-scrollbar flex gap-6">
            <div 
              v-for="col in collections" 
              :key="col.id" 
              class="w-[320px] shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex"
              @click="router.push(`/collection/${col.id}`)"
            >
              <div class="w-24 h-full bg-gray-200 shrink-0">
                <img :src="col.cover" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-sm mb-1 text-gray-900 line-clamp-1">{{ col.title }}</h4>
                  <p class="text-[10px] text-gray-500 line-clamp-2">{{ col.description }}</p>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-xs font-bold text-blue-600">¥{{ col.price }}</span>
                  <el-tag size="small" type="info">{{ col.docCount }} 篇</el-tag>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Latest Uploads -->
        <section>
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <el-icon class="text-green-600"><Clock /></el-icon>
            最新上传
          </h3>
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div v-for="(doc, idx) in documents.slice(10, 20)" :key="doc.id" 
              class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 cursor-pointer"
              @click="router.push(`/document/${doc.id}`)"
            >
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <el-icon v-if="doc.format === 'pdf'" class="text-red-500" :size="20"><Document /></el-icon>
                <el-icon v-else class="text-blue-500" :size="20"><Document /></el-icon>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer">{{ doc.title }}</h4>
                <div class="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{{ doc.category }}</span>
                  <span>•</span>
                  <span>{{ doc.uploadTime }}</span>
                </div>
              </div>
              <div class="text-right shrink-0">
                <div class="text-xs font-bold text-gray-700">{{ doc.price > 0 ? '¥' + doc.price : '免费' }}</div>
                <el-button link type="primary" size="small">预览</el-button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Area: Rankings & Banner -->
      <div class="lg:col-span-1">
        <div class="sticky top-20 space-y-8">
          <!-- 4. Rankings -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold">排行榜</h3>
              <el-tabs v-model="rankTab" class="ranking-tabs">
                <el-tab-pane label="日榜" name="day" />
                <el-tab-pane label="周榜" name="week" />
                <el-tab-pane label="月榜" name="month" />
              </el-tabs>
            </div>
            <div class="space-y-2">
              <div 
                v-for="(doc, idx) in documents.slice(0, 10)" 
                :key="doc.id"
                class="flex items-center gap-3 py-2 group cursor-pointer"
                @click="router.push(`/document/${doc.id}`)"
              >
                <div :class="[
                  'w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0',
                  idx < 3 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                ]">
                  {{ idx + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-700 truncate group-hover:text-blue-600 transition-colors">{{ doc.title }}</p>
                </div>
                <span class="text-[10px] text-gray-300">{{ (2000 - idx * 150) + Math.floor(Math.random() * 50) }}</span>
              </div>
            </div>
            <el-button class="w-full mt-6" plain>查看完整榜单</el-button>
          </div>

          <!-- Banner / Quick Links -->
          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white overflow-hidden relative shadow-lg cursor-pointer hover:scale-[1.02] transition-transform" @click="router.push('/vip')">
            <div class="relative z-10">
              <h4 class="font-bold text-lg mb-1">升级高级会员</h4>
              <p class="text-xs text-white/70 mb-4">每日享10次免费下载权限</p>
              <el-button type="warning" size="small" bg @click.stop="router.push('/vip')">立即开通</el-button>
            </div>
            <el-icon class="absolute -bottom-4 -right-4 text-white/10" :size="100"><Trophy /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../../components/AppLayout.vue'
import { 
  Histogram, ArrowRight, View, Download, StarFilled, 
  CollectionTag, Clock, Document, Trophy,
  Reading, Notebook, Cpu, Brush, Files, HotWater, Memo, HelpFilled
} from '@element-plus/icons-vue'
import { mockDocuments as documents, mockCollections as collections } from '../../mock'

const router = useRouter()
const handleCatClick = (cat: any) => {
  if (cat.name === '悬赏') {
    router.push('/tasks')
    return
  }
  if (cat.name === '最新') {
    router.push({ path: '/search', query: { sort: 'newest' } })
    return
  }
  if (cat.name === '热门') {
    router.push({ path: '/search', query: { sort: 'downloads' } })
    return
  }
  router.push({ path: '/search', query: { q: cat.name } })
}

const banners = [
  {
    title: '2026 考研季',
    subtitle: '核心资料大放送，名师划重点，冲刺最后一公里',
    image: 'https://picsum.photos/seed/banner1/1200/400'
  },
  {
    title: '新用户专属福利',
    subtitle: '限时 9.9 元领取超值 VIP 月卡，开启无限搜索',
    image: 'https://picsum.photos/seed/banner2/1200/400'
  },
  {
    title: '热门合集推荐',
    subtitle: '公考行测、申论范文集，结构化面试干货包',
    image: 'https://picsum.photos/seed/banner3/1200/400'
  }
]

const catNav = [
  { name: '考研', icon: markRaw(Reading), color: 'bg-blue-500' },
  { name: '公考', icon: markRaw(Notebook), color: 'bg-red-500' },
  { name: '编程', icon: markRaw(Cpu), color: 'bg-slate-700' },
  { name: '设计', icon: markRaw(Brush), color: 'bg-purple-500' },
  { name: '合同', icon: markRaw(Files), color: 'bg-orange-500' },
  { name: '热门', icon: markRaw(HotWater), color: 'bg-pink-500' },
  { name: '最新', icon: markRaw(Memo), color: 'bg-green-500' },
  { name: '悬赏', icon: markRaw(HelpFilled), color: 'bg-yellow-500' }
]

const rankTab = ref('day')
</script>



<style scoped>
.home-carousel :deep(.el-carousel__button) {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: #E5E7EB;
  opacity: 0.6;
  transition: all 0.3s;
}
.home-carousel :deep(.el-carousel__indicator--active .el-carousel__button) {
  width: 64px;
  opacity: 1;
  background: #374151;
}
.home-carousel :deep(.el-carousel__item--card) {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s;
}
.home-carousel :deep(.el-carousel__item:not(.is-active)) {
  opacity: 0.4;
  filter: blur(1px);
}
.home-carousel :deep(.el-carousel__arrow) {
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  width: 48px;
  height: 48px;
  font-size: 20px;
}
.home-carousel :deep(.el-carousel__arrow:hover) {
  background-color: rgba(255, 255, 255, 0.4);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

:deep(.ranking-tabs .el-tabs__header) {
  margin: 0;
  border-bottom: none;
}
:deep(.ranking-tabs .el-tabs__nav-wrap::after) {
  display: none;
}
:deep(.ranking-tabs .el-tabs__item) {
  padding: 0 8px;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
}
</style>

