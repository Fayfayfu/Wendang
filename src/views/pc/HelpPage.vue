<template>
  <AppLayout>
    <div class="max-w-[1200px] mx-auto py-12 px-4">
      <div class="mb-12 text-center">
        <h1 class="text-3xl font-black text-gray-900 mb-4">帮助中心</h1>
        <p class="text-gray-500">遇到问题了？在这里您可以找到大部分常见问题的解答</p>
      </div>

      <div class="flex gap-8 items-start">
        <!-- Left Sidebar Navigation -->
        <aside class="w-64 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
          <div class="p-2">
            <div 
              v-for="item in categories" 
              :key="item.id"
              class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group mb-1"
              :class="activeCategory === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'"
              @click="activeCategory = item.id"
            >
              <el-icon :size="18" :class="activeCategory === item.id ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'">
                <component :is="item.icon" />
              </el-icon>
              <span class="text-sm font-medium">{{ item.label }}</span>
            </div>
          </div>
          <div class="p-4 mt-4 border-t bg-gray-50/50">
            <div class="flex flex-col items-center gap-3 py-4">
               <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center border shadow-sm">
                 <el-icon class="text-blue-600" :size="24"><Service /></el-icon>
               </div>
               <div class="text-center">
                 <p class="text-xs font-bold text-gray-900">仍未解决问题？</p>
                 <el-button link type="primary" size="small" class="mt-1">在线反馈工单</el-button>
               </div>
            </div>
          </div>
        </aside>

        <!-- Right Content Area -->
        <main class="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[600px]">
          <h2 class="text-xl font-bold text-gray-900 mb-8 pb-4 border-b">
            {{ categories.find(c => c.id === activeCategory)?.label }}
          </h2>

          <div v-if="activeCategory === 'faq'">
            <el-collapse accordion class="help-collapse">
              <el-collapse-item 
                v-for="(item, idx) in faqList" 
                :key="idx" 
                :title="item.question" 
                :name="idx"
              >
                <div class="text-gray-500 leading-relaxed text-sm whitespace-pre-line">
                  {{ item.answer }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>

          <div v-else-if="activeCategory === 'upload'" class="prose prose-sm max-w-none text-gray-600">
             <h3 class="font-bold text-gray-900">上传步骤</h3>
             <ol class="list-decimal pl-5 space-y-4">
                <li>点击导航栏的“上传文档”按钮。</li>
                <li>将符合格式要求的文档拖入上传区域或点击选择文件。</li>
                <li>填写文档相关信息：标题、分类、标签及简介（完善的信息有助于被更多人搜到）。</li>
                <li>设置文档下载价格：可选免费、VIP免费或设置金额。</li>
                <li>确认提交后，文档将进入人工审核队列。</li>
             </ol>
             <h3 class="font-bold text-gray-900 mt-8">格式要求</h3>
             <ul class="list-disc pl-5 space-y-2">
                <li>支持 PDF, Word (DOC/DOCX), PowerPoint (PPT/PPTX), Excel (XLS/XLSX), TXT。</li>
                <li>单个文件限制在 100MB 以内。</li>
                <li>请确保文档内容清晰，无乱码，无恶意广告链接。</li>
             </ul>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-20">
             <el-empty :description="`${categories.find(c => c.id === activeCategory)?.label} 详情正在更新中...`" />
          </div>
        </main>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import { 
  QuestionFilled, Upload, Download, Trophy, 
  ChatLineRound, Lock, Service 
} from '@element-plus/icons-vue'

const activeCategory = ref('faq')

const categories = [
  { id: 'faq', label: '常见问题', icon: QuestionFilled },
  { id: 'upload', label: '上传指南', icon: Upload },
  { id: 'download', label: '下载指南', icon: Download },
  { id: 'vip', label: '会员权益', icon: Trophy },
  { id: 'feedback', label: '投诉建议', icon: ChatLineRound },
  { id: 'privacy', label: '隐私政策', icon: Lock },
]

const faqList = [
  {
    question: '文档上传后多久能审核通过？',
    answer: '通常情况下，文库文档会在 1-2 小时内完成人工审核。在工作日（9:00-18:00），审核速度会更快；夜间或节假日提交的文档可能需要更长时间。如果您发现文档超过 24 小时未审核，请联系在线客服。'
  },
  {
    question: '上传文档赚取的收益如何提现？',
    answer: '当其他用户购买并下载您的文档后，所得收入（平台收取 20% 技术服务费）将直接存入您的账户。您可以在“个人中心 - 收益管理”中申请提现至微信或支付宝，单次提现金额需满 10 元，提现审核时间一般为 1-3 个工作日。'
  },
  {
    question: '为什么我的文档上传失败？',
    answer: '可能由于以下原因：\n1. 文件大小超过了 100MB 限制。\n2. 文件格式不在支持范围内。\n3. 网络连接不稳定导致上传中断。\n4. 文档含有涉及违规、敏感或侵权的内容，被系统过滤。'
  },
  {
    question: '如何获取更高权重的展示？',
    answer: '1. 确保文档标题准确且包含热门关键词。\n2. 补充详尽的文档简介，有助于搜索引擎抓取。\n3. 提升您的信誉等级：在文库内活跃并上传高质量文档，会获得系统自动加权推荐。'
  }
]
</script>

<style scoped>
.help-collapse :deep(.el-collapse-item__header) {
  height: 64px;
  font-weight: bold;
  font-size: 15px;
  color: #374151;
  border-bottom-color: #f3f4f6;
}
.help-collapse :deep(.el-collapse-item__content) {
  padding-top: 10px;
  padding-bottom: 24px;
}
</style>
