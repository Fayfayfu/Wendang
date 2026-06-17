<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4 border-b border-gray-50 flex justify-between items-center">
      <h3 class="font-bold text-gray-800">首页轮播图配置</h3>
      <el-button type="primary" :icon="PlusIcon" @click="handleAdd">新增轮播图</el-button>
    </div>

    <div class="p-4">
      <el-table :data="banners" style="width: 100%">
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column label="预览图" width="200">
          <template #default="{ row }">
            <el-image :src="row.image" class="w-40 h-20 rounded shadow-sm object-cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="link" label="跳转链接" min-width="150" />
        <el-table-column label="有效期" width="200">
          <template #default="{ row }">
            <div class="text-[10px] text-gray-500">
              {{ row.startTime }} 至 {{ row.endTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
             <el-switch v-model="row.active" inline-prompt active-text="开" inactive-text="关" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="visible" title="新增轮播图" width="500">
      <el-form label-width="80px">
        <el-form-item label="封面图片">
          <div class="w-full h-32 bg-gray-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-400 transition-colors">
            <el-icon :size="24"><Camera /></el-icon>
            <span class="text-xs mt-2">点击上传图片 (建议 1200x400)</span>
          </div>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="form.link" placeholder="请输入跳转链接或页面ID" />
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="!w-full"
          />
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { Plus, Camera } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const PlusIcon = markRaw(Plus)
const visible = ref(false)
const form = ref({ title: '', link: '', sort: 0, dateRange: [] })

const banners = ref([
  { id: 1, sort: 1, image: 'https://images.unsplash.com/photo-1512418490979-92798ccc13b0?q=80&w=2070', title: '2026暑期大促', link: '/promo/summer', startTime: '2026-06-01', endTime: '2026-08-31', active: true },
  { id: 2, sort: 2, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070', title: '新版 AI 助手上线', link: '/ai-intro', startTime: '2026-05-10', endTime: '2026-12-31', active: true }
])

const handleAdd = () => {
  form.value = { title: '', link: '', sort: 0, dateRange: [] }
  visible.value = true
}

const handleSubmit = () => {
  ElMessage.success('配置已保存')
  visible.value = false
}

const handleDelete = (banner: any) => {
  ElMessageBox.confirm('确定要删除此轮播图吗？', '提示', { type: 'warning' }).then(() => {
    banners.value = banners.value.filter(b => b.id !== banner.id)
    ElMessage.success('已删除')
  })
}
</script>
