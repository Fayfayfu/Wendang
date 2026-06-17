import { mockUsers } from './users';
import { mockDocuments } from './documents';
import { mockCollections } from './collections';
import { mockTasks } from './tasks';
import { mockOrders, mockReports, mockWorkOrders } from './orders_etc';
import { mockCreditLogs } from './creditLogs';

export const mockFetch = async <T>(url: string): Promise<{ code: number; data: T; message: string }> => {
  console.log('Mocking request to:', url);
  let data: any = {};
  
  if (url.includes('/api/users')) data = mockUsers;
  else if (url.includes('/api/documents')) data = mockDocuments;
  else if (url.includes('/api/collections')) data = mockCollections;
  else if (url.includes('/api/tasks')) data = mockTasks;
  else if (url.includes('/api/orders')) data = mockOrders;
  else if (url.includes('/api/reports')) data = mockReports;
  else if (url.includes('/api/tickets')) data = mockWorkOrders;
  else if (url.includes('/api/credit-logs')) data = mockCreditLogs;

  return {
    code: 200,
    data: data as T,
    message: 'success'
  }
}

export {
  mockUsers,
  mockDocuments,
  mockCollections,
  mockTasks,
  mockOrders,
  mockReports,
  mockWorkOrders,
  mockCreditLogs
};
