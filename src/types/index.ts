/**
 * 稳当文档 - 完整类型体系
 */

/**
 * 用户状态
 */
export enum UserStatus {
  NORMAL = 0,    // 正常
  BANNED = 1,    // 封禁
  PENDING = 2    // 待审核
}

/**
 * 用户
 */
export interface User {
  id: string;               // 用户唯一标识
  nickname: string;         // 昵称
  avatar: string;           // 头像URL
  email?: string;           // 邮箱
  phone?: string;           // 手机号
  score: number;            // 信誉分
  level: number;            // 等级
  status: UserStatus;       // 账号状态
  isVip: boolean;           // 是否是VIP
  vipExpire?: string;       // VIP过期时间
  balance: number;          // 账户余额
}

/**
 * 文档状态
 */
export enum DocumentStatus {
  REVIEWING = 0, // 审核中
  PUBLISHED = 1, // 已发布
  REJECTED = 2,  // 审核拒绝
  OFFLINE = 3    // 已下架
}

/**
 * 文档
 */
export interface Document {
  id: string;               // 文档唯一标识
  title: string;            // 标题
  cover: string;            // 封面图URL
  description: string;      // 描述
  category: string;         // 分类
  tags: string[];           // 标签集合
  pages: number;            // 页数
  price: number;            // 价格 (元)
  downloadCount: number;    // 下载次数
  favorCount: number;       // 收藏次数
  rating: number;           // 评分
  uploader: string | Partial<User>; // 上传者ID或简要信息
  uploadTime: string;       // 上传时间
  format: string;           // 文件格式 (pdf, doc, ppt等)
  status: DocumentStatus;   // 文档状态
}

/**
 * 文集状态
 */
export enum CollectionStatus {
  PUBLIC = 1,    // 公开
  PRIVATE = 2    // 私有
}

/**
 * 文集 (多个文档的合集)
 */
export interface Collection {
  id: string;               // 文集唯一标识
  userId: string;           // 创建者用户ID
  cover: string;            // 文集封面
  title: string;            // 文集标题
  description: string;      // 文集描述
  price: number;            // 文集打包价格
  docCount: number;         // 文档总数
  totalDownloads: number;   // 总下载量
  totalRevenue: number;     // 总收益
  status: CollectionStatus; // 状态
  docs?: Document[];        // 关联的文档列表
}

/**
 * 任务状态
 */
export enum TaskStatus {
  PENDING = 0,   // 待认领
  IN_PROGRESS = 1, // 进行中
  COMPLETED = 2,   // 已完成
  EXPIRED = 3,      // 已过期/关闭
  REVIEWING = 4    // 待验收
}

/**
 * 悬赏任务
 */
export interface Task {
  id: string;               // 任务唯一标识
  publisherId: string;      // 发布者用户ID
  assigneeId?: string;      // 承接者用户ID
  title: string;            // 任务标题
  description: string;      // 任务详细描述
  category: string;         // 任务分类
  reward: number;           // 任务悬赏金额
  status: TaskStatus;       // 任务状态
  deadline: string;         // 截止时间
  createdAt: string;        // 创建时间
}

/**
 * 支付订单
 */
export interface Order {
  id: string;               // 订单ID
  userId: string;           // 用户ID
  targetId: string;         // 目标ID (文档ID或文集ID)
  targetType: 'doc' | 'collection' | 'vip' | 'task'; // 交易类型
  amount: number;           // 金额
  paymentMethod: string;    // 支付方式 (微信、支付宝)
  status: 'pending' | 'success' | 'failed'; // 状态
  createdAt: string;        // 创建时间
}

/**
 * 收益记录
 */
export interface Revenue {
  id: string;               // 记录ID
  userId: string;           // 获益用户ID
  sourceId: string;         // 来源ID (订单ID)
  amount: number;           // 收益金额
  type: 'upload_sale' | 'task_reward' | 'referral'; // 收益类型
  createdAt: string;        // 时间
}

/**
 * 信誉分变动记录
 */
export interface ScoreChange {
  id: string;
  userId: string;
  change: number;           // 变动分值 (正负)
  reason: string;           // 变动原因
  createdAt: string;
}

/**
 * 举报记录
 */
export interface Report {
  id: string;
  reporterId: string;       // 举报人
  targetId: string;         // 被举报的目标ID
  targetType: 'doc' | 'user' | 'comment'; // 目标类型
  reason: string;           // 举报理由
  images?: string[];        // 证据截图
  status: 'pending' | 'handled' | 'rejected'; // 处理状态
  createdAt: string;
}

/**
 * 工单/反馈
 */
export interface WorkOrder {
  id: string;
  userId: string;           // 发起人
  title: string;
  content: string;
  category: 'bug' | 'suggestion' | 'appeal'; // 分类
  status: 'open' | 'closed' | 'replied'; // 状态
  createdAt: string;
}

export type Theme = 'light' | 'dark';
