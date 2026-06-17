import { Collection, CollectionStatus } from '../types';
import { mockDocuments } from './documents';

export const mockCollections: Collection[] = [
  {
    id: 'c1',
    userId: 'u2',
    cover: 'https://picsum.photos/seed/c1/300/400',
    title: '考研数学全程班资料包',
    description: '包含高等数学、线性代数、概率统计所有核心讲义与习题。',
    price: 29.9,
    docCount: 15,
    totalDownloads: 1200,
    totalRevenue: 35880,
    status: CollectionStatus.PUBLIC,
    docs: mockDocuments.slice(0, 5)
  },
  {
    id: 'c2',
    userId: 'u5',
    cover: 'https://picsum.photos/seed/c2/300/400',
    title: '英语作文万能模板集',
    description: '针对考研、四六级、雅思托福的精品模板。',
    price: 9.9,
    docCount: 8,
    totalDownloads: 3500,
    totalRevenue: 34650,
    status: CollectionStatus.PUBLIC,
    docs: mockDocuments.slice(5, 8)
  },
  {
    id: 'c3',
    userId: 'u3',
    cover: 'https://picsum.photos/seed/c3/300/400',
    title: '公考申论范文100篇',
    description: '涵盖近五年各省市公考申论高分范文。',
    price: 19.9,
    docCount: 100,
    totalDownloads: 800,
    totalRevenue: 15920,
    status: CollectionStatus.PUBLIC,
    docs: mockDocuments.slice(8, 12)
  },
  {
    id: 'c4',
    userId: 'u1',
    cover: 'https://picsum.photos/seed/c4/300/400',
    title: '前端工程化实战文档手册',
    description: 'Vite/Webpack/TS等前端架构核心文档说明。',
    price: 39.0,
    docCount: 12,
    totalDownloads: 450,
    totalRevenue: 17550,
    status: CollectionStatus.PUBLIC,
    docs: mockDocuments.slice(12, 15)
  },
  {
    id: 'c5',
    userId: 'u5',
    cover: 'https://picsum.photos/seed/c5/300/400',
    title: '企业劳动合同范本全集',
    description: '涵盖各种用工形式的安全合法合同模板。',
    price: 49.0,
    docCount: 50,
    totalDownloads: 200,
    totalRevenue: 9800,
    status: CollectionStatus.PUBLIC,
    docs: mockDocuments.slice(15, 20)
  }
];
