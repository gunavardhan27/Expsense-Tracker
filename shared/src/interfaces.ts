import { Category, SortOrder } from './enums';

export interface Expense {
  id: string;                  // UUID v4
  amount: string;              // decimal string e.g. "1234.56"
  category: Category;
  description: string;
  date: string;                // ISO 8601 date string "YYYY-MM-DD"
  created_at: string;          // ISO 8601 datetime
}

export interface CreateExpensePayload {
  idempotency_key: string;     // UUID v4 generated client-side
  amount: string;              // decimal string validated server-side
  category: Category;
  description: string;
  date: string;                // "YYYY-MM-DD"
}

export interface GetExpensesQuery {
  category?: Category;
  sort?: SortOrder;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ExpensesListResponse {
  expenses: Expense[];
  total: string;               // sum as decimal string, computed server-side after filter
}
