<template>
  <AppLayout>
    <div class="max-w-[1240px] mx-auto py-8 px-4">
      <div class="flex gap-8 items-start">
        <!-- Sidebar Navigation -->
        <aside class="w-64 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
          <div class="p-6 text-center border-b border-gray-50 bg-gray-50/50">
            <el-avatar :size="64" :src="userStore.user?.avatar" class="mb-3 border-2 border-white shadow-sm" />
            <h3 class="font-bold text-gray-900 mb-1">{{ userStore.user?.nickname }}</h3>
            <el-tag v-if="userStore.user?.isVip" type="warning" size="small" effect="dark" class="bg-gradient-to-r from-yellow-400 to-orange-500 border-none">VIP 会员</el-tag>
            <el-tag v-else type="info" size="small" effect="plain" class="rounded-full">普通用户</el-tag>
          </div>
          <div class="p-2">
            <div 
              v-for="item in menuItems" 
              :key="item.value"
              class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group mb-1"
              :class="activeMenu === item.value ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'"
              @click="activeMenu = item.value"
            >
              <el-icon :size="18" :class="activeMenu === item.value ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'">
                <component :is="item.icon" />
              </el-icon>
              <span class="text-sm font-medium">{{ item.label }}</span>
            </div>
          </div>
          <div class="p-4 mt-4 border-t">
            <el-button type="danger" plain class="w-full" @click="handleLogout">退出登录</el-button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[600px]">
            <!-- 1. Personal Info -->
            <div v-if="activeMenu === 'info'" class="space-y-8">
              <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                <el-icon class="text-blue-600"><User /></el-icon> 账户资料
              </h2>
              <el-form label-position="top" class="max-w-xl">
                <div class="flex items-center gap-6 mb-8">
                   <el-avatar :size="100" :src="userStore.user?.avatar" />
                   <div class="space-y-2">
                     <el-button size="small">更换头像</el-button>
                     <p class="text-[10px] text-gray-400">支持 JPG, PNG 格式，建议尺寸 200x200px</p>
                   </div>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <el-form-item label="昵称">
                    <el-input v-model="profileForm.nickname" />
                  </el-form-item>
                  <el-form-item label="登录手机号">
                    <el-input v-model="profileForm.mobile" disabled />
                  </el-form-item>
                </div>
                <el-form-item label="认证状态">
                   <div class="flex items-center gap-2">
                      <el-tag type="info">未认证</el-tag>
                      <el-button link type="primary">去认证</el-button>
                   </div>
                </el-form-item>
                <el-form-item label="个人简介">
                  <el-input type="textarea" :rows="4" v-model="profileForm.bio" placeholder="向大家介绍一下你自己吧..." />
                </el-form-item>
                <div class="pt-6">
                  <el-button type="primary" class="px-8" @click="saveProfile">保存修改</el-button>
                </div>
              </el-form>
            </div>

            <!-- 2. My Uploads -->
            <div v-else-if="activeMenu === 'upload'">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <el-icon class="text-blue-600"><Upload /></el-icon> 我的上传
                </h2>
                <el-button type="primary" :icon="Plus" @click="router.push('/upload')">上传新文档</el-button>
              </div>

              <el-tabs v-model="uploadTab" class="mb-6">
                <el-tab-pane label="全部文档" name="all" />
                <el-tab-pane label="已发布" name="published" />
                <el-tab-pane label="审核中" name="pending" />
                <el-tab-pane label="未通过" name="failed" />
              </el-tabs>

              <el-table :data="myUploads" style="width: 100%" v-loading="loading">
                <el-table-column label="文档信息" min-width="250">
                  <template #default="scope">
                    <div class="flex gap-3 items-center">
                      <div class="w-10 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                        <img :src="scope.row.cover" class="w-full h-full object-cover" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-bold truncate text-gray-900 group-hover:text-blue-600 cursor-pointer" @click="router.push(`/document/${scope.row.id}`)">{{ scope.row.title }}</p>
                        <p class="text-[10px] text-gray-400 mt-1">{{ scope.row.uploadTime }}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="getStatusType(scope.row.status)" size="small">
                      {{ scope.row.status === 1 ? '已发布' : '审核中' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="downloadCount" label="下载" width="80" sortable />
                <el-table-column prop="price" label="收益" width="100">
                  <template #default="scope">
                    <span class="text-orange-600 font-bold" v-if="scope.row.price > 0">{{ scope.row.price * (scope.row.downloadCount || 10) }}</span>
                    <span class="text-gray-400" v-else>0</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default>
                    <el-button link type="primary">编辑</el-button>
                    <el-divider direction="vertical" />
                    <el-button link type="danger">下架</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 3. My Favorites -->
            <div v-else-if="activeMenu === 'fav'">
              <h2 class="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <el-icon class="text-blue-600"><Star /></el-icon> 我的收藏
              </h2>
              <el-row :gutter="20">
                <el-col v-for="doc in myFavorites" :key="doc.id" :span="6" class="mb-6">
                  <div class="group bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all overflow-hidden relative">
                    <div class="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                       <img :src="doc.cover" class="w-full h-full object-cover" />
                       <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                          <el-button type="danger" size="small" plain @click="unFavorite(doc.id)">取消收藏</el-button>
                       </div>
                    </div>
                    <div class="p-3">
                      <h4 class="text-xs font-bold text-gray-900 truncate mb-1">{{ doc.title }}</h4>
                      <p class="text-[10px] text-gray-400">{{ doc.category }} | {{ doc.format.toUpperCase() }}</p>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-empty v-if="myFavorites.length === 0" description="暂无收藏文档" />
            </div>

            <!-- 4. My Downloads -->
            <div v-else-if="activeMenu === 'download'">
              <h2 class="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <el-icon class="text-blue-600"><Download /></el-icon> 我的下载
              </h2>
              <el-table :data="myDownloads">
                <el-table-column label="文档">
                   <template #default="scope">
                     <div class="flex items-center gap-3">
                       <div class="w-8 h-10 bg-gray-50 shrink-0 border rounded overflow-hidden">
                          <img :src="scope.row.cover" class="w-full h-full object-cover" />
                       </div>
                       <span class="text-sm font-medium truncate">{{ scope.row.title }}</span>
                     </div>
                   </template>
                </el-table-column>
                <el-table-column label="下载价格" width="120">
                   <template #default="scope">
                     <span class="text-orange-600 font-bold">{{ scope.row.price || '免费' }}</span>
                   </template>
                </el-table-column>
                <el-table-column label="购买时间" width="180">
                   <template #default>2026-05-18 10:24</template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                   <template #default>
                     <el-button link type="primary" :icon="Download">再次下载</el-button>
                   </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 5. My Collections -->
            <div v-else-if="activeMenu === 'collection'">
              <div class="flex justify-between items-center mb-8">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <el-icon class="text-blue-600"><Collection /></el-icon> 我的个人文集
                </h2>
                <el-button type="primary" :icon="Plus" class="rounded-xl font-bold" @click="createCollectionVisible = true">创建新文集</el-button>
              </div>

              <el-tabs v-model="collectionTab" class="mb-6">
                <el-tab-pane label="已上架" name="published" />
                <el-tab-pane label="审核中" name="reviewing" />
                <el-tab-pane label="草稿箱" name="draft" />
              </el-tabs>

              <div class="space-y-4">
                <div 
                  v-for="col in filteredCollections" 
                  :key="col.id" 
                  class="bg-white border border-gray-100 rounded-2xl p-4 flex gap-6 hover:shadow-sm transition-shadow group relative"
                >
                  <!-- Cover -->
                  <div class="w-32 h-44 bg-gray-50 rounded-xl overflow-hidden border shrink-0 cursor-pointer" @click="router.push(`/collection/${col.id}`)">
                    <img :src="col.cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <h4 class="text-lg font-bold text-gray-900 truncate cursor-pointer hover:text-blue-600" @click="router.push(`/collection/${col.id}`)">
                          {{ col.title }}
                        </h4>
                        <el-tag :type="getCollectionStatusType(col.status)" size="small" effect="plain" class="rounded-lg">
                          {{ getCollectionStatusText(col.status) }}
                        </el-tag>
                      </div>
                      <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                        {{ col.description }}
                      </p>
                      
                      <div class="flex flex-wrap items-center gap-4 text-[11px] text-gray-400">
                        <span class="flex items-center gap-1"><el-icon><Document /></el-icon> {{ col.docCount }} 篇文档</span>
                        <span class="flex items-center gap-1"><el-icon><Download /></el-icon> {{ col.totalDownloads }} 次下载</span>
                        <span class="flex items-center gap-1"><el-icon><WalletFilled /></el-icon> 累计收益 ¥{{ (col.price * col.totalDownloads * 0.8).toFixed(2) }}</span>
                        <span class="text-gray-300">|</span>
                        <span class="text-orange-600 font-bold">售价 ¥{{ col.price }}</span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 mt-4">
                      <el-button size="small" :icon="Edit">编辑内容</el-button>
                      <el-button v-if="col.status === 'published'" size="small" type="warning" plain>下架</el-button>
                      <el-button v-if="col.status === 'draft' || col.status === 'reviewing'" size="small" type="success" plain>立即上架</el-button>
                      <el-button size="small" type="danger" plain :icon="Delete">删除</el-button>
                    </div>
                  </div>
                </div>
              </div>
              
              <el-empty v-if="filteredCollections.length === 0" description="暂无该状态下的文集" />
            </div>

            <!-- 6. My Earnings -->
            <div v-else-if="activeMenu === 'earning'">
              <h2 class="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <el-icon class="text-blue-600"><WalletFilled /></el-icon> 我的收益中心
              </h2>
              
              <div class="grid grid-cols-3 gap-6 mb-8">
                <div class="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 p-6 rounded-2xl shadow-sm">
                  <p class="text-gray-500 text-xs mb-2">可提现余额 (元)</p>
                  <div class="flex items-baseline gap-1">
                    <span class="text-sm font-bold text-red-600">¥</span>
                    <h3 class="text-4xl font-black text-red-600 italic leading-none">286.50</h3>
                  </div>
                  <el-button 
                    type="primary" 
                    class="w-full mt-6 !bg-blue-600 !border-blue-600 shadow-lg shadow-blue-100 h-10 rounded-xl font-bold"
                    @click="withdrawVisible = true"
                  >
                    申请提现
                  </el-button>
                </div>
                
                <div class="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div>
                    <p class="text-gray-400 text-xs mb-2">本月预估收益</p>
                    <div class="flex items-baseline gap-1">
                      <span class="text-xs font-bold text-gray-900">¥</span>
                      <h3 class="text-2xl font-bold text-gray-900">320.00</h3>
                    </div>
                  </div>
                  <div class="mt-4 pt-4 border-t border-gray-50 bg-gray-50/30 -mx-6 px-6 py-2">
                    <p class="text-[10px] text-gray-400 flex items-center gap-1">
                      <el-icon><InfoFilled /></el-icon> 统计粒度：实时计算
                    </p>
                  </div>
                </div>

                <div class="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                   <div>
                     <p class="text-gray-400 text-xs mb-2">累计收益</p>
                     <div class="flex items-baseline gap-1">
                       <span class="text-xs font-bold text-gray-900">¥</span>
                       <h3 class="text-2xl font-bold text-gray-900">2,560.00</h3>
                     </div>
                   </div>
                   <div class="mt-4 pt-4 border-t border-gray-50 bg-gray-50/30 -mx-6 px-6 py-2">
                     <p class="text-[10px] text-gray-400">已扣除 20% 平台服务费</p>
                   </div>
                </div>
              </div>

              <div class="bg-blue-50/50 rounded-xl p-4 mb-8 flex items-center gap-3 border border-blue-100">
                <el-icon class="text-blue-500" :size="18"><InfoFilled /></el-icon>
                <p class="text-[11px] text-blue-700">收益提现规则：单笔最低 50 元起提，每月限提 1 次。申请后 1-3 个工作日内完成人工审核并到账。</p>
              </div>

              <el-tabs v-model="earningTab" class="earning-tabs mt-8">
                <el-tab-pane label="收益明细" name="list">
                  <el-table :data="mockEarningRecords" size="default" class="mt-4">
                    <el-table-column label="交易时间" prop="time" width="180" />
                    <el-table-column label="关联文档" min-width="240">
                      <template #default="scope">
                        <span class="text-sm font-medium text-gray-700 truncate block">{{ scope.row.target }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="类型" width="120">
                      <template #default="scope">
                        <el-tag :type="scope.row.type === 'subsidy' ? 'warning' : 'success'" size="small" effect="plain">
                          {{ scope.row.type === 'subsidy' ? '免费补贴' : '付费下载' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="收益额" width="120">
                      <template #default="scope">
                        <span class="text-green-600 font-bold">+{{ scope.row.amount }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                      <template #default>
                        <span class="text-gray-400 text-xs">已入账</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="提现记录" name="withdraw">
                  <el-table :data="mockWithdrawRecords" size="default" class="mt-4">
                    <el-table-column label="申请时间" prop="time" width="180" />
                    <el-table-column label="提现金额" width="140">
                      <template #default="scope">
                        <span class="font-bold">¥ {{ scope.row.amount }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="提现渠道" prop="method" width="120" />
                    <el-table-column label="审核状态" width="120">
                      <template #default="scope">
                        <el-tag :type="getWithdrawStatusType(scope.row.status)" size="small">
                          {{ getWithdrawStatusText(scope.row.status) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                      <template #default="scope">
                        <el-button v-if="scope.row.status === 'failed'" link type="primary" size="small">查看详情</el-button>
                        <span v-else class="text-gray-300">-</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>

            <!-- 7. My Reputation -->
            <div v-else-if="activeMenu === 'reputation'">
              <h2 class="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <el-icon class="text-blue-600"><Compass /></el-icon> 我的信誉成长
              </h2>
              
              <div class="grid grid-cols-12 gap-8 mb-10">
                <!-- Left: Score Card -->
                <div class="col-span-12 lg:col-span-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div class="flex flex-col md:flex-row items-center gap-12">
                    <!-- Custom CSS Circular Progress -->
                    <div class="relative w-48 h-48 flex items-center justify-center">
                      <svg class="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" fill="none" stroke="#f1f5f9" stroke-width="12" />
                        <circle 
                          cx="96" cy="96" r="88" fill="none" 
                          stroke="url(#grad_reputation)" 
                          stroke-width="12" 
                          :stroke-dasharray="2 * Math.PI * 88" 
                          :stroke-dashoffset="2 * Math.PI * 88 * (1 - animatedScore / 100)"
                          stroke-linecap="round"
                          class="transition-all duration-[1500ms] ease-out"
                        />
                        <defs>
                          <linearGradient id="grad_reputation" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#fef08a;stop-opacity:1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div class="absolute flex flex-col items-center">
                        <span class="text-5xl font-black text-gray-900 leading-none">{{ Math.round(animatedScore) }}</span>
                        <div class="mt-2 px-3 py-1 bg-yellow-100 border border-yellow-200 rounded-full text-[10px] font-bold text-yellow-700">
                          黄色 · 一般
                        </div>
                      </div>
                    </div>

                    <!-- Details -->
                    <div class="flex-1">
                      <div class="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <p class="text-xs text-gray-400 mb-1">上周变动</p>
                          <p class="text-xl font-bold text-red-500">-8 <span class="text-xs font-normal text-gray-400 ml-1">分 (违规)</span></p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-400 mb-1">预计本周恢复</p>
                          <p class="text-xl font-bold text-green-600">+5 <span class="text-xs font-normal text-gray-400 ml-1">分 (待审核)</span></p>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <p class="text-xs text-gray-400">信誉等级分布说明</p>
                        <div class="flex items-center gap-1 h-2 rounded-full overflow-hidden">
                           <div class="flex-1 bg-red-400" title="0-60 极差"></div>
                           <div class="flex-1 bg-orange-400" title="61-80 预警"></div>
                           <div class="flex-1 bg-yellow-400" title="81-94 一般"></div>
                           <div class="flex-1 bg-blue-400" title="95-98 优秀"></div>
                           <div class="flex-1 bg-green-500" title="99-100 卓越"></div>
                        </div>
                        <div class="flex justify-between text-[10px] text-gray-300 font-medium px-1">
                           <span>极差</span>
                           <span>预警</span>
                           <span>一般</span>
                           <span>优秀</span>
                           <span>卓越</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <el-tabs v-model="reputationTab" class="mb-8">
                <el-tab-pane label="扣分明细" name="deductions">
                  <el-table :data="reputationDeductions" border class="rounded-xl overflow-hidden">
                    <el-table-column prop="time" label="变动时间" width="180" />
                    <el-table-column prop="reason" label="变动原因" min-width="200" />
                    <el-table-column label="变动分值" width="120">
                      <template #default="scope">
                        <span class="text-red-500 font-bold">{{ scope.row.change }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="current" label="当前余分" width="120" />
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="加分记录" name="bonuses">
                  <el-table :data="reputationBonuses" border class="rounded-xl overflow-hidden">
                    <el-table-column prop="time" label="变动时间" width="180" />
                    <el-table-column prop="reason" label="变动原因" min-width="200" />
                    <el-table-column label="变动分值" width="120">
                      <template #default="scope">
                        <span class="text-green-500 font-bold">{{ scope.row.change }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="current" label="当前余分" width="120" />
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>

            <!-- 8. Feedback & Tickets -->
            <div v-else-if="activeMenu === 'ticket'">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <el-icon class="text-blue-600"><Postcard /></el-icon> 售后工单与投诉
                </h2>
                <el-button type="primary" :icon="Plus" @click="newTicketVisible = true">创建新工单</el-button>
              </div>

              <el-tabs v-model="ticketTab" class="mb-6">
                <el-tab-pane label="全部工单" name="all" />
                <el-tab-pane label="待处理" name="pending" />
                <el-tab-pane label="处理中" name="processing" />
                <el-tab-pane label="已结案" name="closed" />
              </el-tabs>

              <el-table :data="filteredTickets" style="width: 100%" v-loading="loading">
                <el-table-column label="工单编号" width="180">
                  <template #default="scope">
                    <span class="text-xs font-mono text-gray-500">{{ scope.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="标题" min-width="250">
                  <template #default="scope">
                    <div class="flex items-center gap-2">
                      <el-tag size="small" :type="getTicketTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
                      <span class="text-sm font-bold truncate text-gray-800">{{ scope.row.title }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="120">
                  <template #default="scope">
                    <el-tag :type="getTicketStatusType(scope.row.status)" size="small" effect="plain" class="rounded-full">
                      {{ getTicketStatusText(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="最近更新" width="180">
                   <template #default="scope">{{ scope.row.updateTime }}</template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" @click="handleViewTicket(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <el-empty v-if="filteredTickets.length === 0" description="暂无相关工单记录" />
            </div>

            <!-- 9. My Tasks -->
            <div v-else-if="activeMenu === 'task'">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <el-icon class="text-blue-600"><HelpFilled /></el-icon> 悬赏任务管理
                </h2>
                <el-button type="primary" :icon="Plus" @click="handleGoToTaskSquare">前往任务广场</el-button>
              </div>

              <el-tabs v-model="taskTab" class="mb-6">
                <el-tab-pane label="我承接的任务" name="taker" />
                <el-tab-pane label="我发布的悬赏" name="issuer" />
              </el-tabs>

              <div v-if="taskTab === 'taker'">
                <el-table :data="myTakerTasks" style="width: 100%" v-loading="loading">
                  <el-table-column label="任务标题" min-width="250">
                    <template #default="scope">
                      <div class="flex flex-col">
                        <span class="text-sm font-bold text-gray-800 truncate">{{ scope.row.title }}</span>
                        <span class="text-[10px] text-gray-400 mt-1">发布人：{{ scope.row.issuerName }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="赏金" width="120">
                    <template #default="scope">
                      <span class="text-orange-600 font-bold text-lg">¥{{ scope.row.reward }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="120">
                    <template #default="scope">
                      <el-tag :type="getTaskStatusType(scope.row.status)" size="small" effect="plain" class="rounded-full">
                        {{ getTaskStatusText(scope.row.status) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="截止时间" width="160">
                     <template #default="scope">{{ scope.row.deadline }}</template>
                  </el-table-column>
                  <el-table-column label="操作" width="150" fixed="right">
                    <template #default="scope">
                      <el-button link type="primary" @click="handleTaskDetail(scope.row.id)">查看详情</el-button>
                      <el-divider direction="vertical" />
                      <el-button v-if="scope.row.status === 'processing'" link type="success" @click="handleSubmitTaskData(scope.row)">提交资料</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div v-else>
                <el-table :data="myIssuerTasks" style="width: 100%" v-loading="loading">
                  <el-table-column label="任务标题" min-width="250">
                    <template #default="scope">
                      <span class="text-sm font-bold text-gray-800 truncate">{{ scope.row.title }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="赏金" width="120">
                    <template #default="scope">
                      <span class="text-gray-900 font-bold">¥{{ scope.row.reward }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="120">
                    <template #default="scope">
                      <el-tag :type="getTaskStatusType(scope.row.status)" size="small" effect="plain" class="rounded-full">
                        {{ getTaskStatusText(scope.row.status) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="参与人数" width="100">
                    <template #default="scope">
                      <span class="text-xs text-gray-500">{{ scope.row.takerCount }} 人申请</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150" fixed="right">
                    <template #default="scope">
                      <el-button link type="primary" @click="handleTaskDetail(scope.row.id)">管理任务</el-button>
                      <el-divider v-if="scope.row.status === 'finished'" direction="vertical" />
                      <el-button v-if="scope.row.status === 'finished'" link type="warning" @click="handleReviewTask(scope.row)">评价</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <el-empty v-if="taskTab === 'taker' ? myTakerTasks.length === 0 : myIssuerTasks.length === 0" description="暂无相关任务记录" />
            </div>

            <!-- Generic placeholder for other tabs -->
            <div v-else class="flex flex-col items-center justify-center py-20">
               <el-empty description="该模块正在开发中，敬请期待" />
            </div>
          </div>
        </main>
      </div>
    </div>
    <!-- Withdrawal Dialog -->
    <el-dialog v-model="withdrawVisible" title="申请提现" width="440" align-center>
      <div class="py-2">
        <div class="bg-gray-50 p-6 rounded-2xl mb-8">
          <p class="text-xs text-gray-400 mb-1">当前可提现金额</p>
          <h4 class="text-2xl font-black text-gray-900">¥ 286.50</h4>
        </div>

        <el-form :model="withdrawForm" label-position="top">
          <el-form-item label="提现金额 (元)" required>
            <el-input-number 
              v-model="withdrawForm.amount" 
              :min="50" 
              :max="286.50" 
              precision="2" 
              class="!w-full" 
              controls-position="right"
            />
            <p class="text-[10px] text-gray-400 mt-2">单笔提现最小金额为 50 元</p>
          </el-form-item>
          
          <el-form-item label="提现方式" required>
            <el-radio-group v-model="withdrawForm.method" class="w-full grid grid-cols-2 gap-4">
              <el-radio-button label="wechat" class="!w-full">微信支付</el-radio-button>
              <el-radio-button label="alipay" class="!w-full">支付宝</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="账号姓名" required>
            <el-input v-model="withdrawForm.name" placeholder="请输入实名认证姓名" />
          </el-form-item>
          
          <el-form-item :label="withdrawForm.method === 'wechat' ? '微信/手机号' : '支付宝账号'" required>
            <el-input v-model="withdrawForm.account" placeholder="请输入提现账号" />
          </el-form-item>
        </el-form>

        <div class="mt-8">
          <el-button type="primary" size="large" class="w-full h-12 rounded-xl font-bold" @click="handleWithdraw" :loading="withdrawing">
            确认申请提现
          </el-button>
          <p class="text-[10px] text-center text-gray-400 mt-4">申请即代表您已核对账号信息准确无误</p>
        </div>
      </div>
    </el-dialog>
    <!-- Create Collection Dialog -->
    <el-dialog v-model="createCollectionVisible" title="创建新文集" width="800" align-center destroy-on-close>
      <div class="py-2">
        <el-row :gutter="40">
          <el-col :span="10">
            <h5 class="font-bold text-gray-900 mb-4">基本信息</h5>
            <el-form label-position="top">
              <el-form-item label="文集名称" required>
                <el-input v-model="collectionForm.title" placeholder="例如：2026考研核心复习包" />
              </el-form-item>
              <el-form-item label="详情描述" required>
                <el-input v-model="collectionForm.description" type="textarea" :rows="4" placeholder="描述文集包含的内容和核心价值..." />
              </el-form-item>
              <el-form-item label="建议定价 (元)">
                <el-input-number v-model="collectionForm.price" :min="1" :precision="1" class="!w-full" />
              </el-form-item>
              <div class="p-4 bg-blue-50 rounded-xl border border-blue-100 mt-4">
                <p class="text-[10px] text-blue-600 leading-relaxed">
                  提示：文集定价建议为单篇文档总价的 5-8 折左右，更能吸引用户购买。
                </p>
              </div>
            </el-form>
          </el-col>
          
          <el-col :span="14">
            <h5 class="font-bold text-gray-900 mb-4 flex justify-between items-center">
              内容编排 
              <span class="text-[10px] font-normal text-gray-400">拖拽可调整排序</span>
            </h5>
            
            <div class="border border-gray-100 rounded-2xl overflow-hidden mb-6">
              <div class="bg-gray-50 px-4 py-2 text-[10px] font-bold text-gray-400 flex border-b">
                <span class="w-8 shrink-0">序号</span>
                <span class="flex-1">文档标题</span>
                <span class="w-12 shrink-0">操作</span>
              </div>
              <draggable 
                v-model="collectionForm.docs" 
                item-key="id"
                class="max-h-[300px] overflow-y-auto"
                ghost-class="bg-blue-50"
              >
                <template #item="{ element, index }">
                  <div class="px-4 py-3 border-b last:border-b-0 bg-white flex items-center gap-3 cursor-move hover:bg-gray-50/80 transition-colors">
                    <span class="w-8 shrink-0 text-xs text-gray-300 italic font-black">{{ index + 1 }}</span>
                    <div class="flex-1 min-w-0 flex items-center gap-2">
                       <el-icon class="text-gray-300 shrink-0"><MenuIcon /></el-icon>
                       <span class="text-xs text-gray-700 truncate font-medium">{{ element.title }}</span>
                    </div>
                    <el-button link type="danger" :icon="Delete" @click="removeDocFromCollection(index)" />
                  </div>
                </template>
                <template #footer>
                  <div v-if="collectionForm.docs.length === 0" class="py-12 text-center text-gray-300 text-xs">
                    还没有添加文档，请从下方待选列表中选择
                  </div>
                </template>
              </draggable>
            </div>

            <h5 class="font-bold text-gray-900 mb-3 text-xs">待选文档 (选择加入)</h5>
            <div class="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-1">
               <div 
                 v-for="doc in myAvailableDocs" 
                 :key="doc.id"
                 class="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 group"
                 @click="addDocToCollection(doc)"
               >
                 <el-icon class="text-gray-300 group-hover:text-blue-500"><Plus /></el-icon>
                 <span class="max-w-[120px] truncate">{{ doc.title }}</span>
               </div>
            </div>
          </el-col>
        </el-row>
        
        <div class="mt-12 flex justify-end gap-3 pt-6 border-t">
          <el-button @click="createCollectionVisible = false" class="rounded-xl px-6">取消</el-button>
          <el-button type="primary" class="rounded-xl px-12 font-bold shadow-lg shadow-blue-100" @click="handleCreateCollection">
            确认创建并提交审核
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- New Ticket Dialog -->
    <el-dialog v-model="newTicketVisible" title="发起投诉与售后" width="600" align-center destroy-on-close>
      <div class="py-2">
        <el-form :model="ticketForm" label-position="top">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="问题类型" required>
                <el-select v-model="ticketForm.type" class="w-full">
                  <el-option label="BUG反馈" value="BUG" />
                  <el-option label="功能建议" value="建议" />
                  <el-option label="版权投诉" value="投诉" />
                  <el-option label="充值/提现" value="财务" />
                  <el-option label="其他问题" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="工单标题" required>
                <el-input v-model="ticketForm.title" placeholder="请用一句话简述您的问题" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="详细说明" required>
            <el-input
              v-model="ticketForm.description"
              type="textarea"
              :rows="5"
              placeholder="请详细描述您遇到的问题，以便我们高效为您解决..."
            />
          </el-form-item>

          <el-form-item label="证据截图 (选填)">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="4"
              multiple
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>

        <div class="mt-8 flex justify-end gap-3">
          <el-button @click="newTicketVisible = false" class="rounded-xl px-6">取消</el-button>
          <el-button 
            type="primary" 
            class="rounded-xl px-10 font-bold" 
            :loading="submittingTicket"
            @click="handleSubmitTicket"
          >
            确认提交工单
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- Ticket Detail Dialog -->
    <el-dialog v-model="ticketDetailVisible" :title="'工单详情 - ' + (selectedTicket?.title || '')" width="700" align-center>
      <template #header>
        <div class="flex items-center gap-3">
          <span class="font-bold">工单详情</span>
          <el-tag v-if="selectedTicket" size="small" :type="getTicketStatusType(selectedTicket.status)">{{ getTicketStatusText(selectedTicket.status) }}</el-tag>
        </div>
      </template>
      
      <div class="max-h-[60vh] overflow-y-auto px-2 py-4">
        <!-- Message Flow -->
        <div class="space-y-6">
          <div v-for="(msg, idx) in ticketMessages" :key="idx" class="flex flex-col" :class="msg.role === 'admin' ? 'items-start' : 'items-end'">
            <div class="flex items-center gap-2 mb-2" :class="msg.role === 'admin' ? 'flex-row' : 'flex-row-reverse'">
              <el-avatar :size="24" :src="msg.role === 'admin' ? 'https://img.icons8.com/color/48/manager.png' : userStore.user?.avatar" />
              <span class="text-xs font-bold text-gray-500">{{ msg.role === 'admin' ? '官方客服' : '我' }}</span>
              <span class="text-[10px] text-gray-300">{{ msg.time }}</span>
            </div>
            
            <div 
              class="max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed"
              :class="msg.role === 'admin' ? 'bg-blue-50 text-blue-900 rounded-tl-none' : 'bg-gray-100 text-gray-800 rounded-tr-none'"
            >
              {{ msg.content }}
              
              <div v-if="msg.images && msg.images.length > 0" class="flex gap-2 mt-3">
                <el-image 
                  v-for="(img, i) in msg.images" 
                  :key="i"
                  :src="img"
                  :preview-src-list="msg.images"
                  class="w-20 h-20 rounded-lg border bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div v-if="selectedTicket?.status !== 'closed'" class="pt-4 border-t">
          <div class="flex gap-3">
            <el-input 
              v-model="replyText" 
              placeholder="回复工单..." 
              @keyup.enter="handleReplyTicket"
            />
            <el-button type="primary" :icon="Position" @click="handleReplyTicket">回复</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store'
import AppLayout from '@/components/AppLayout.vue'
import { 
  User, Upload, Star, Download, Collection, 
  HelpFilled, WalletFilled, Compass, Postcard, 
  Plus, InfoFilled, Edit, Delete, Document,
  Picture, Menu as MenuIcon, Search, Position
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
import { mockDocuments, mockCollections } from '@/mock'

const router = useRouter()
const userStore = useMainStore()

// Create Collection Logic
const createCollectionVisible = ref(false)
const collectionForm = reactive({
  title: '',
  description: '',
  price: 9.9,
  docs: [] as any[]
})

const myAvailableDocs = computed(() => {
  return mockDocuments.slice(0, 10) // Just for demo
})

const addDocToCollection = (doc: any) => {
  if (collectionForm.docs.find(d => d.id === doc.id)) {
    ElMessage.warning('该文档已在清单中')
    return
  }
  collectionForm.docs.push({ ...doc })
}

const removeDocFromCollection = (index: number) => {
  collectionForm.docs.splice(index, 1)
}

const handleCreateCollection = () => {
  if (!collectionForm.title) {
    ElMessage.error('请输入文集名称')
    return
  }
  if (collectionForm.docs.length < 2) {
    ElMessage.error('文集至少需要包含 2 篇文档')
    return
  }
  ElMessage.success('文集创建成功，已提交审核')
  createCollectionVisible.value = false
}

onMounted(() => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    router.push('/login')
  }
})

const activeMenu = ref('info')

// Animated Reputation Score
const animatedScore = ref(100)
watch(activeMenu, (newMenu) => {
  if (newMenu === 'reputation') {
    animatedScore.value = 100
    setTimeout(() => {
      animatedScore.value = userStore.user?.score || 92
    }, 100)
  }
})

const uploadTab = ref('all')
const collectionTab = ref('published')
const earningTab = ref('list')
const reputationTab = ref('deductions')
const ticketTab = ref('all')
const taskTab = ref('taker')
const loading = ref(false)

const handleGoToTaskSquare = () => {
  console.log('Navigating to task square...')
  router.push({ name: '任务广场' })
}

const handleTaskDetail = (id: string) => {
  router.push({ name: '任务详情', params: { id } })
}

const handleSubmitTaskData = (task: any) => {
  ElMessage.success(`准备为任务【${task.title}】提交资料`)
  // Real implementation would open a dialog or redirect
  router.push({ name: '任务详情', params: { id: task.id }, query: { action: 'submit' } })
}

const handleReviewTask = (task: any) => {
  ElMessage.info(`正在前往评价任务【${task.title}】`)
}

const myTakerTasks = ref([
  { id: 'T1001', title: '急需2025年同济大学建筑系考研复试真题', reward: 50, status: 'processing', deadline: '2026-05-25', issuerName: '考研路漫漫' },
  { id: 'T1005', title: 'Python爬虫抓取某电商网站数据脚本', reward: 200, status: 'checking', deadline: '2026-05-20', issuerName: '技术宅小明' },
  { id: 'T1008', title: '帮写一份2000字的社会实践报告', reward: 80, status: 'finished', deadline: '2026-05-15', issuerName: '快乐大学生' },
])

const myIssuerTasks = ref([
  { id: 'T2002', title: '寻求一份完整的智慧城市建设方案PPT', reward: 150, status: 'accepting', takerCount: 5, time: '2026-05-18' },
  { id: 'T2006', title: '2026广东公务员行测各模块复习思维导图', reward: 30, status: 'finished', takerCount: 12, time: '2026-05-10' },
])

const getTaskStatusType = (status: string) => {
  switch (status) {
    case 'accepting': return 'primary'
    case 'processing': return 'warning'
    case 'checking': return 'info'
    case 'finished': return 'success'
    case 'closed': return 'danger'
    default: return ''
  }
}

const getTaskStatusText = (status: string) => {
  switch (status) {
    case 'accepting': return '招募中'
    case 'processing': return '进行中'
    case 'checking': return '待验收'
    case 'finished': return '已完成'
    case 'closed': return '已关闭'
    default: return '未知'
  }
}

const newTicketVisible = ref(false)
const submittingTicket = ref(false)
const ticketForm = reactive({
  type: 'BUG',
  title: '',
  description: ''
})

const ticketDetailVisible = ref(false)
const selectedTicket = ref<any>(null)
const replyText = ref('')
const ticketMessages = ref<any[]>([])

const mockTickets = ref([
  { id: 'TK2026051801', title: '支付成功后余额未更新', type: '财务', status: 'pending', updateTime: '2026-05-18 10:20' },
  { id: 'TK2026051705', title: '文档上传建议改为拖拽式', type: '建议', status: 'processing', updateTime: '2026-05-18 09:15' },
  { id: 'TK2026051012', title: '举报某文档侵犯我司版权', type: '投诉', status: 'closed', updateTime: '2026-05-12 14:00' },
])

const filteredTickets = computed(() => {
  if (ticketTab.value === 'all') return mockTickets.value
  return mockTickets.value.filter(t => t.status === ticketTab.value)
})

const getTicketTypeTag = (type: string) => {
  switch (type) {
    case 'BUG': return 'danger'
    case '投诉': return 'warning'
    case '财务': return 'success'
    case '建议': return 'info'
    default: return ''
  }
}

const getTicketStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'info'
    case 'processing': return 'primary'
    case 'closed': return 'success'
    default: return ''
  }
}

const getTicketStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'processing': return '处理中'
    case 'closed': return '已结案'
    default: return '未知'
  }
}

const handleViewTicket = (ticket: any) => {
  selectedTicket.value = ticket
  ticketDetailVisible.value = true
  // Mock conversation
  ticketMessages.value = [
    { 
      role: 'user', 
      content: ticket.title + ': ' + (ticket.description || '详细描述如标题所示。'), 
      time: ticket.updateTime,
      images: ['https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=400&q=80']
    },
    { 
      role: 'admin', 
      content: '您好，我们已收到您反馈的问题，正在核实处理中，请耐心等待。', 
      time: '2024-05-18 11:30' 
    }
  ]
}

const handleReplyTicket = () => {
  if (!replyText.value.trim()) return
  ticketMessages.value.push({
    role: 'user',
    content: replyText.value,
    time: new Date().toLocaleString()
  })
  replyText.value = ''
  
  // Auto admin mock reply
  setTimeout(() => {
    ticketMessages.value.push({
      role: 'admin',
      content: '收到回复，正在跟进中。',
      time: new Date().toLocaleString()
    })
  }, 1000)
}

const handleSubmitTicket = () => {
  if (!ticketForm.title || !ticketForm.description) {
    ElMessage.warning('请填写完整的工单信息')
    return
  }
  submittingTicket.value = true
  setTimeout(() => {
    submittingTicket.value = false
    newTicketVisible.value = false
    ElMessage.success('工单提交成功，我们将会在 24 小时内处理')
    mockTickets.value.unshift({
      id: 'TK' + Date.now().toString().slice(-8),
      title: ticketForm.title,
      type: ticketForm.type,
      status: 'pending',
      updateTime: new Date().toLocaleString().split(' ')[0]
    })
    // Reset
    Object.assign(ticketForm, { type: 'BUG', title: '', description: '' })
  }, 1500)
}

const reputationDeductions = [
  { time: '2026-05-15 14:20', reason: '任务《大型建筑项目可行性研究报告》超时未提交资料', change: '-5', current: '92' },
  { time: '2026-04-12 09:30', reason: '上传文档包含违规内容被系统驳回', change: '-2', current: '97' },
  { time: '2026-03-20 18:15', reason: '任务交付内容质量低下被用户投诉', change: '-1', current: '99' },
]

const reputationBonuses = [
  { time: '2026-05-10 10:00', reason: '成功处理一起侵权举报，协助平台维护版权', change: '+2', current: '100' },
  { time: '2026-04-01 12:00', reason: '连续 30 天活跃且无任何投诉记录', change: '+10', current: '98' },
  { time: '2026-03-15 16:45', reason: '上传的文档被评选为“月度精品文档”', change: '+5', current: '88' },
]

const creating = ref(false)
const searchDocQuery = ref('')
const selectedDocIds = ref<string[]>([])
const selectedDocsForSorting = ref<any[]>([])

// Sync selectedDocsForSorting with selectedDocIds
watch(selectedDocIds, (newIds) => {
  const currentIds = selectedDocsForSorting.value.map(d => d.id)
  
  // Add new
  newIds.forEach(id => {
    if (!currentIds.includes(id)) {
      const doc = myUploads.value.find(d => d.id === id)
      if (doc) selectedDocsForSorting.value.push(doc)
    }
  })
  
  // Remove missing
  selectedDocsForSorting.value = selectedDocsForSorting.value.filter(d => newIds.includes(d.id))
}, { deep: true, immediate: true })

const createColForm = reactive({
  title: '',
  description: '',
  cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  isPaid: false,
  price: 9.9
})

const searchableUploads = computed(() => {
  return myUploads.value.filter(d => d.title.toLowerCase().includes(searchDocQuery.value.toLowerCase()))
})

const removeSelected = (id: string) => {
  selectedDocIds.value = selectedDocIds.value.filter(sid => sid !== id)
}

const handleSortChange = () => {
  selectedDocIds.value = selectedDocsForSorting.value.map(d => d.id)
}

const handleLegacyCreateCollection = () => {
  creating.value = true
  setTimeout(() => {
    creating.value = false
    createCollectionVisible.value = false
    ElMessage.success('文集创建成功，已进入审核流程')
    // Reset form
    Object.assign(createColForm, {
      title: '',
      description: '',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
      isPaid: false,
      price: 9.9
    })
    selectedDocIds.value = []
    selectedDocsForSorting.value = []
  }, 1500)
}

const withdrawVisible = ref(false)
const withdrawing = ref(false)
const withdrawForm = reactive({
  amount: 50,
  method: 'wechat',
  name: '',
  account: ''
})

const menuItems = [
  { label: '账户资料', value: 'info', icon: markRaw(User) },
  { label: '我的上传', value: 'upload', icon: markRaw(Upload) },
  { label: '我的收藏', value: 'fav', icon: markRaw(Star) },
  { label: '我的下载', value: 'download', icon: markRaw(Download) },
  { label: '我的文集', value: 'collection', icon: markRaw(Collection) },
  { label: '悬赏任务', value: 'task', icon: markRaw(HelpFilled) },
  { label: '收益管理', value: 'earning', icon: markRaw(WalletFilled) },
  { label: '信誉评价', value: 'reputation', icon: markRaw(Compass) },
  { label: '售后工单', value: 'ticket', icon: markRaw(Postcard) },
]

const profileForm = reactive({
  nickname: userStore.user?.nickname || '',
  mobile: '138****8888',
  bio: '分享知识，共同成长。'
})

const myUploads = computed(() => {
  return mockDocuments.slice(0, 6).map((d, index) => ({
    ...d,
    status: index % 4 === 0 ? 0 : 1 // Mock pending/published
  }))
})

const myFavorites = ref([...mockDocuments.slice(4, 8)])
const myDownloads = ref([...mockDocuments.slice(0, 4)])

const mockedCollections = computed(() => {
  return mockCollections.slice(0, 5).map((c, i) => ({
    ...c,
    status: i === 0 ? 'reviewing' : (i === 1 ? 'draft' : 'published')
  }))
})

const filteredCollections = computed(() => {
  return mockedCollections.value.filter(c => c.status === collectionTab.value)
})

const getCollectionStatusType = (status: string) => {
  switch (status) {
    case 'published': return 'success'
    case 'reviewing': return 'warning'
    case 'draft': return 'info'
    default: return ''
  }
}

const getCollectionStatusText = (status: string) => {
  switch (status) {
    case 'published': return '已上架'
    case 'reviewing': return '审核中'
    case 'draft': return '草稿'
    default: return ''
  }
}

const mockEarningRecords = [
  { target: '下载收益：考研英语真题解析(2025)', amount: '12.40', time: '2026-05-18 14:22', type: 'paid' },
  { target: '平台奖励：优质文章推荐周榜', amount: '50.00', time: '2026-05-17 09:00', type: 'subsidy' },
  { target: '下载收益：Java核心技术笔记', amount: '8.80', time: '2026-05-16 23:15', type: 'paid' },
  { target: '提现退回：由于账户异常', amount: '200.00', time: '2026-05-15 10:00', type: 'paid' },
]

const mockWithdrawRecords = ref([
  { time: '2026-05-10 10:00', amount: '100.00', method: '支付宝', status: 'finished' },
  { time: '2026-04-05 14:30', amount: '500.00', method: '微信', status: 'finished' },
  { time: '2026-03-01 09:15', amount: '300.00', method: '支付宝', status: 'failed' },
])

const getStatusType = (status: number) => {
  return status === 1 ? 'success' : 'warning'
}

const getWithdrawStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'finished': return 'success'
    case 'failed': return 'danger'
    default: return 'info'
  }
}

const getWithdrawStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待审核'
    case 'finished': return '已到账'
    case 'failed': return '被驳回'
    default: return '未知'
  }
}

const handleWithdraw = () => {
  if (!withdrawForm.name || !withdrawForm.account) {
    ElMessage.warning('请填写完整的准确账号信息')
    return
  }
  withdrawing.value = true
  setTimeout(() => {
    withdrawing.value = false
    withdrawVisible.value = false
    ElMessage.success('提现申请提已提交，请耐心等待审核')
    mockWithdrawRecords.value.unshift({
      time: new Date().toLocaleString(),
      amount: withdrawForm.amount.toFixed(2),
      method: withdrawForm.method === 'wechat' ? '微信' : '支付宝',
      status: 'pending'
    })
  }, 1500)
}

const unFavorite = (id: string) => {
  myFavorites.value = myFavorites.value.filter(d => d.id !== id)
  ElMessage.success('已取消收藏')
}

const saveProfile = () => {
  userStore.setUser({
    ...userStore.user!,
    nickname: profileForm.nickname
  })
  ElMessage.success('资料已保存')
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.info('已退出登录')
  router.push('/')
}
</script>

<style scoped>
:deep(.el-tabs__item) {
  font-weight: bold;
}
:deep(.el-tabs__nav-wrap::after) {
  display: none;
}
</style>
