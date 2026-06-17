import { Task, TaskStatus } from '../types';

export const mockTasks: Task[] = [
  {
    id: 't1',
    publisherId: 'u1',
    title: '寻找2025年某省地质勘测报告',
    description: '急需该报告用于毕业论文参考，要求完整版。',
    category: '文档代找',
    reward: 50,
    status: TaskStatus.PENDING,
    deadline: '2026-06-01',
    createdAt: '2026-05-10'
  },
  {
    id: 't2',
    publisherId: 'u2',
    assigneeId: 'u1',
    title: '整理考研政治考点思维导图',
    description: '需要将最新的大纲变动整理成清晰的思维导图。',
    category: '资料整理',
    reward: 100,
    status: TaskStatus.IN_PROGRESS,
    deadline: '2026-06-15',
    createdAt: '2026-05-12'
  },
  {
    id: 't3',
    publisherId: 'u5',
    assigneeId: 'u2',
    title: '公司内刊稿件代写',
    description: '主题为"企业文化与员工成长"，字数2000字左右。',
    category: '写作',
    reward: 300,
    status: TaskStatus.COMPLETED,
    deadline: '2026-05-20',
    createdAt: '2026-05-01'
  },
  {
    id: 't4',
    publisherId: 'u1',
    title: '外文文献翻译(德语)',
    description: '一篇关于工业4.0的德文摘要，约500字。',
    category: '翻译',
    reward: 80,
    status: TaskStatus.PENDING,
    deadline: '2026-06-30',
    createdAt: '2026-05-15'
  },
  {
    id: 't5',
    publisherId: 'u3',
    title: '找寻老旧地方志电子版',
    description: '寻找《某某县志》1980年版。',
    category: '文档代找',
    reward: 150,
    status: TaskStatus.EXPIRED,
    deadline: '2026-05-01',
    createdAt: '2026-04-10'
  },
  {
    id: 't6',
    publisherId: 'u2',
    title: '求职面试经验合集整理',
    description: '针对互联网大厂的前端岗位面试复盘。',
    category: '资料整理',
    reward: 200,
    status: TaskStatus.PENDING,
    deadline: '2026-07-01',
    createdAt: '2026-05-17'
  },
  {
    id: 't7',
    publisherId: 'u5',
    assigneeId: 'u3',
    title: '企业安全生产规章制度修订',
    description: '根据最新国家标准修订现有的规章制度。',
    category: '攻略',
    reward: 500,
    status: TaskStatus.IN_PROGRESS,
    deadline: '2026-06-20',
    createdAt: '2026-05-14'
  },
  {
    id: 't8',
    publisherId: 'u2',
    title: '某景区全攻略文档制作',
    description: '包含交通、住宿、避坑指南等。',
    category: '攻略',
    reward: 60,
    status: TaskStatus.PENDING,
    deadline: '2026-06-05',
    createdAt: '2026-05-16'
  },
  {
    id: 't9',
    publisherId: 'u1',
    assigneeId: 'u3',
    title: '【加急】某大型建筑项目可行性研究报告',
    description: '需要一份完整的可行性研究报告模板，包含财务分析和风险评估。',
    category: '文档代找',
    reward: 120,
    status: TaskStatus.REVIEWING,
    deadline: '2026-05-30',
    createdAt: '2026-05-18'
  }
];
