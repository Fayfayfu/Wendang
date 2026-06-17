import { Document, DocumentStatus } from '../types';

const categories = ['考研', '公考', '编程', '设计', '合同'];
const formats = ['pdf', 'docx', 'pptx', 'xlsx'];
const uploaderIds = ['u1', 'u2', 'u3', 'u5'];

export const mockDocuments: Document[] = Array.from({ length: 20 }).map((_, index) => {
  const cat = categories[index % categories.length];
  const format = formats[index % formats.length];
  const uploaderId = uploaderIds[index % uploaderIds.length];
  const isVipFree = index % 3 === 0;
  const isFree = index % 5 === 0;

  return {
    id: `d${index + 1}`,
    title: `${cat}分类下的优质文档资源 ${index + 1}`,
    cover: `https://picsum.photos/seed/doc${index + 1}/200/280`,
    description: `这是一份关于${cat}的深入研究资料，包含了核心要点和实战案例。格式为${format}，质量极高。`,
    category: cat,
    tags: [cat, '精选', format],
    pages: Math.floor(Math.random() * 100) + 10,
    price: isFree ? 0 : (isVipFree ? 10 : 20),
    downloadCount: Math.floor(Math.random() * 1000),
    favorCount: Math.floor(Math.random() * 500),
    rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
    uploader: uploaderId,
    uploadTime: `2026-0${Math.floor(Math.random() * 9) + 1}-12`,
    format: format,
    status: DocumentStatus.PUBLISHED
  };
});
