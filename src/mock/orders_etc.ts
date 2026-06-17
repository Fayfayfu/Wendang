import { Order, Report, WorkOrder } from '../types';

export const mockOrders: Order[] = [
  {
    id: 'o1',
    userId: 'u1',
    targetId: 'd1',
    targetType: 'doc',
    amount: 10,
    paymentMethod: '余额',
    status: 'success',
    createdAt: '2026-05-15 12:00:00'
  },
  {
    id: 'o2',
    userId: 'u2',
    targetId: 'c1',
    targetType: 'collection',
    amount: 29.9,
    paymentMethod: '支付宝',
    status: 'success',
    createdAt: '2026-05-16 15:30:00'
  }
];

export const mockReports: Report[] = [
  {
    id: 'r1',
    reporterId: 'u1',
    targetId: 'd10',
    targetType: 'doc',
    reason: '侵犯版权，原件在某某网站',
    status: 'pending',
    createdAt: '2026-05-14 09:00:00'
  }
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: 'w1',
    userId: 'u1',
    title: '无法下载已支付的文档',
    content: '我支付了文档d1，但点击下载一直提示网络错误。',
    category: 'bug',
    status: 'replied',
    createdAt: '2026-05-16 20:00:00'
  }
];
