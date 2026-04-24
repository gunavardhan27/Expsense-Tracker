import { Expense, CreateExpensePayload } from '../../shared/src/interfaces';

export interface ExpenseRow {
  id: string;           // sourced from Mongo's _id (as string)
  idempotency_key: string;
  amount_minor: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface IExpenseRepository {
  findByIdempotencyKey(key: string): Promise<ExpenseRow | null>;
  insert(row: Omit<ExpenseRow, 'id'>): Promise<ExpenseRow>;
  findAll(filter?: { category?: string; sortDateDesc?: boolean }): Promise<ExpenseRow[]>;
}

export interface IExpenseService {
  createExpense(payload: CreateExpensePayload): Promise<Expense>;
  listExpenses(query: { category?: string; sort?: string }): Promise<{ expenses: Expense[]; total: string }>;
}
