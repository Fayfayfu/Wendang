import { ScoreChange } from '../types';

export const mockCreditLogs: ScoreChange[] = [
  { id: 'sc1', userId: 'u1', change: 5, reason: '上传优质文档被评为精华', createdAt: '2026-05-01 10:00:00' },
  { id: 'sc2', userId: 'u1', change: -2, reason: '举报失效', createdAt: '2026-05-05 14:00:00' },
  { id: 'sc3', userId: 'u4', change: -10, reason: '多次上传违规侵权内容', createdAt: '2026-04-20 09:00:00' },
  { id: 'sc4', userId: 'u4', change: -45, reason: '虚假宣传任务已被封禁', createdAt: '2026-05-10 18:00:00' },
  { id: 'sc5', userId: 'u2', change: 2, reason: '每日签到', createdAt: '2026-05-17 08:00:00' }
];
