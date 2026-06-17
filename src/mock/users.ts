import { User, UserStatus } from '../types';

const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&rounded=true`;

export const mockUsers: User[] = [
  {
    id: 'u1',
    nickname: '张三',
    avatar: getAvatar('张'),
    email: 'zhangsan@example.com',
    phone: '13800000001',
    score: 95,
    level: 5,
    status: UserStatus.NORMAL,
    isVip: false,
    balance: 0
  },
  {
    id: 'u2',
    nickname: '李四',
    avatar: getAvatar('李'),
    email: 'lisi@example.com',
    phone: '13800000002',
    score: 100,
    level: 12,
    status: UserStatus.NORMAL,
    isVip: true,
    vipExpire: '2026-12-31',
    balance: 1560.5
  },
  {
    id: 'u3',
    nickname: 'Admin',
    avatar: getAvatar('A'),
    email: 'admin@wendang.com',
    phone: '13800000000',
    score: 100,
    level: 99,
    status: UserStatus.NORMAL,
    isVip: true,
    vipExpire: '2099-01-01',
    balance: 99999
  },
  {
    id: 'u4',
    nickname: '王五',
    avatar: getAvatar('王'),
    email: 'wangwu@example.com',
    phone: '13800000003',
    score: 45,
    level: 2,
    status: UserStatus.BANNED,
    isVip: false,
    balance: 0
  },
  {
    id: 'u5',
    nickname: '赵六企业服务',
    avatar: getAvatar('赵'),
    email: 'zhaoliu@enterprise.com',
    phone: '13800000004',
    score: 98,
    level: 20,
    status: UserStatus.NORMAL,
    isVip: true,
    vipExpire: '2027-06-01',
    balance: 420
  }
];
